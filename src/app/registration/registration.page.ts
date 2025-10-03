import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfluencerRegistrationDto } from '../dto/influencer-registration.dto';
import { HttpClient } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import {Subscription} from'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class RegistrationPage implements OnInit, OnDestroy {
  influencer: InfluencerRegistrationDto = new InfluencerRegistrationDto();

  // profile-pic fields
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  // control flags
  isSubmitting = false;
  private fileReadInProgress = false;
  private sub?: Subscription;

  // target size (from your sample image)
  private readonly TARGET_WIDTH = 418;
  private readonly TARGET_HEIGHT = 491;
  private readonly IMAGE_QUALITY = 0.85; // JPG quality (0..1)

  private readonly apiUrl = 'http://localhost:1000/influencer/register';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  }

  // ------------ image resize helper ------------
  /**
   * Resize & center-crop a File image to the target width/height.
   * Returns a data URL (JPEG).
   */
  private resizeFileToDataUrl(file: File, targetW = this.TARGET_WIDTH, targetH = this.TARGET_HEIGHT, quality = this.IMAGE_QUALITY): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = (e) => reject(e);
      reader.onload = () => {
        const img = new Image();
        img.onerror = (e) => reject(e);
        img.onload = () => {
          const sw = img.width;
          const sh = img.height;

          // scale to cover (like CSS background-size: cover)
          const scale = Math.max(targetW / sw, targetH / sh);
          // determine source rectangle in original image coordinates
          const sWidth = targetW / scale;
          const sHeight = targetH / scale;
          const sx = Math.max(0, (sw - sWidth) / 2);
          const sy = Math.max(0, (sh - sHeight) / 2);

          const canvas = document.createElement('canvas');
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas not supported'));
            return;
          }

          // draw cropped area from source image into canvas sized targetW x targetH
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, targetW, targetH);

          // convert to data URL (JPEG)
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // ------------ file selection (async) ------------
  // Note: changed to async to await resizing
  async onFileSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    if (!input.files || !input.files[0]) {
      this.clearFile();
      return;
    }

    const file = input.files[0];

    // basic validation
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      input.value = '';
      return;
    }
    const MAX = 10 * 1024 * 1024; // 10 MB client-side cap before resize (adjust if needed)
    if (file.size > MAX) {
      alert('Max file size is 10 MB. Please pick a smaller file.');
      input.value = '';
      return;
    }

    this.selectedFile = file;

    // create a quick preview from object URL while we process
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(file);

    // read + resize to target and set as data url for preview & upload
    this.fileReadInProgress = true;
    try {
      const resizedDataUrl = await this.resizeFileToDataUrl(file, this.TARGET_WIDTH, this.TARGET_HEIGHT, this.IMAGE_QUALITY);
      // set preview and DTO to the resized data URL
      // Using the resized data URL for preview ensures what user sees is what gets uploaded
      if (this.previewUrl) {
        URL.revokeObjectURL(this.previewUrl);
      }
      this.previewUrl = resizedDataUrl;
      this.influencer.profilePicUrl = resizedDataUrl;
    } catch (err) {
      console.error('Image resize failed', err);
      alert('Failed to process image. Please try another file.');
      this.clearFile();
    } finally {
      this.fileReadInProgress = false;
    }
  }

  removeSelectedFile() {
    this.clearFile();
  }

  private clearFile() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
    this.selectedFile = null;
    this.previewUrl = null;
    this.influencer.profilePicUrl = '';
    this.fileReadInProgress = false;
  }

  // ------------ submit ------------
  registerInfluencer() {
    console.log('Registration DTO:', this.influencer);

    // required fields
    if (!this.influencer.fullName || !this.influencer.email || !this.influencer.username || !this.influencer.passwordHash) {
      alert('Please fill required fields: Full name, Email, Username, Password.');
      return;
    }

    // if file selected but not yet processed
    if (this.selectedFile && !this.influencer.profilePicUrl && this.fileReadInProgress) {
      alert('Image is still processing. Please wait a moment.');
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.sub = this.http.post<any>(this.apiUrl, this.influencer, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        console.log('Registration success:', response);
        alert('Registration Successful!');
        this.router.navigateByUrl('/login', { replaceUrl: true });
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Something went wrong, please try again.');
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
