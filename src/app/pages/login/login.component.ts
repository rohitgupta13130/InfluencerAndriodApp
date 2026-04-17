import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  eyeOutline,
  eyeOffOutline,
  logoFacebook,
  logoGoogle
} from 'ionicons/icons';

import { AuthService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
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
export class LoginComponent {

  loginForm: FormGroup;
  loginError = '';
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {

    addIcons({
      mailOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      logoFacebook,
      logoGoogle
    });

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

 login() {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isSubmitting = true;
  this.loginError = '';

  const payload = {
    username: this.loginForm.value.username.trim(),
    password: this.loginForm.value.password.trim()
  };

  this.authService.login(payload).subscribe({
    next: (res: any) => {

      this.isSubmitting = false;

      console.log("Login Response:", res); // 🔍 DEBUG

      // 🔥 FIX 1: SAVE TOKEN
      localStorage.setItem('token', res.token);

      // ✅ store other data
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', res.userName);
      localStorage.setItem('userId', res.userId);
      localStorage.setItem('userType', res.userType);

      // 🔥 FIX 2: SINGLE NAVIGATION
      this.router.navigate(['/dashboard'], { replaceUrl: true });
    },

    error: (err) => {

      this.isSubmitting = false;

      if (err?.error?.errors) {
        const errors = err.error.errors;
        this.loginError = Object.keys(errors)
          .map(key => errors[key].join(', '))
          .join(', ');
      } else {
        this.loginError =
          err?.error?.message ||
          err?.message ||
          'Invalid username or password';
      }
    }
  });
}
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  goRegister() {
    this.router.navigate(['/register']);
  }
}