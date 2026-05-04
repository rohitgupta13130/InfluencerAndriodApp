import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon,
  IonLabel
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  callOutline,
  personOutline,
  imageOutline
} from 'ionicons/icons';

import { AuthService } from '../../services/register.service';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonIcon,
    IonLabel
  ]
})
export class RegisterComponent {

  registerForm: FormGroup;
  registerSuccess = false;
  registerError = '';
  isSubmitting = false;
  selectedFile: File | null = null;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({
      mailOutline,
      lockClosedOutline,
      callOutline,
      personOutline,
      imageOutline
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userTypeId: [1, Validators.required]
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  // ✅ FILE SELECT WITH VALIDATION
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (!allowedTypes.includes(file.type)) {
      this.registerError = 'Only JPG/PNG allowed';
      this.selectedFile = null;
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.registerError = 'File must be less than 2MB';
      this.selectedFile = null;
      return;
    }

    this.registerError = '';
    this.selectedFile = file;
  }

  // ✅ REGISTER
  register() {
    this.formSubmitted = true;

    if (this.registerForm.invalid || !this.selectedFile) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.registerError = '';

    const formData = new FormData();

    formData.append('fullName', this.f['name'].value.trim());
    formData.append('email', this.f['email'].value.trim());
    formData.append('phoneNumber', this.f['phone'].value.trim());
    formData.append('password', this.f['password'].value.trim());
    formData.append('userTypeId', this.f['userTypeId'].value.toString());

    if (this.selectedFile) {
      formData.append('profileImage', this.selectedFile);
    }

    this.authService.register(formData).subscribe({
      next: (res) => {
        console.log('SUCCESS:', res);

        this.isSubmitting = false;
        this.registerSuccess = true;
        this.registerForm.reset();
        this.selectedFile = null;
        this.formSubmitted = false;

        setTimeout(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
        }, 1500);
      },
      error: (err) => {
        console.log('ERROR:', err);

        this.isSubmitting = false;

        // ✅ BETTER ERROR HANDLING
        if (err.status === 400) {
          this.registerError = err.error || 'User already exists';
        } else if (err.status === 500) {
          this.registerError = 'Server error (check backend)';
        } else {
          this.registerError = 'Registration failed';
        }
      }
    });
  }

  gotoLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}