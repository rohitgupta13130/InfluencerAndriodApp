import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfluencerRegistrationDto } from '../dto/influencer-registration.dto';
import { HttpClient} from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

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

  private readonly apiUrl = 'http://localhost:1000/influencer/register';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  }

  // keep JSON flow: convert image to base64 and store in influencer.profilePicUrl
  onFileSelected(e: Event) {
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
    const MAX = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX) {
      alert('Max file size is 5 MB.');
      input.value = '';
      return;
    }

    this.selectedFile = file;

    // preview using object URL
    if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
    this.previewUrl = URL.createObjectURL(file);

    // read file as base64 data URL
    const reader = new FileReader();
    this.fileReadInProgress = true;
    reader.onload = () => {
      this.influencer.profilePicUrl = reader.result as string; // data:image/...
      this.fileReadInProgress = false;
    };
    reader.onerror = () => {
      alert('Failed to read image file.');
      this.clearFile();
      this.fileReadInProgress = false;
    };
    reader.readAsDataURL(file);
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

  registerInfluencer() {
    console.log('Registration DTO:', this.influencer);

    // required fields
    if (!this.influencer.fullName || !this.influencer.email || !this.influencer.username || !this.influencer.passwordHash) {
      alert('Please fill required fields: Full name, Email, Username, Password.');
      return;
    }

    // if file selected but not yet read to base64
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
