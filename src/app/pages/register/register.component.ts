import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonIcon
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  callOutline,
  personOutline
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
    IonIcon
  ]
})
export class RegisterComponent {

  registerForm: FormGroup;
  registerSuccess = false;
  registerError = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

    addIcons({
      mailOutline,
      lockClosedOutline,
      callOutline,
      personOutline
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userTypeId: [1, Validators.required] // ✅ NEW (default User)
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  register() {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.registerError = '';

    const payload = {
      fullName: this.f['name'].value.trim(),
      email: this.f['email'].value.trim(),
      phoneNumber: this.f['phone'].value.trim(),
      password: this.f['password'].value.trim(),
      userTypeId: this.f['userTypeId'].value
    };

    this.authService.register(payload).subscribe({

      next: () => {
        this.isSubmitting = false;
        this.registerSuccess = true;

        this.registerForm.reset();

        setTimeout(() => {
          this.router.navigate(['/login'], { replaceUrl: true });
        }, 1500);
      },

      error: (err) => {
        this.isSubmitting = false;

        if (err?.error?.errors) {
          const errors = err.error.errors;

          this.registerError = Object.keys(errors)
            .map(key => errors[key].join(', '))
            .join(', ');
        } else {
          this.registerError =
            err?.error?.message ||
            'Registration failed. Try again.';
        }
      }
    });
  }

  gotoLogin() {
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}