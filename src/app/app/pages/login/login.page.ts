// src/app/pages/login/login.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonItem, IonIcon } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonButton, IonInput, IonItem, IonIcon, CommonModule, FormsModule],
})
export class LoginPage implements OnInit {
  username = '';
  password = '';
  showPassword = false;
  logoUrl = '';
  loading = false;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authSvc: AuthService
  ) {
    // optional: add icons if needed
    addIcons({});
  }

  ngOnInit() {
    // attempt to fetch logo from backend (optional)
    this.http.get<{ logoUrl: string }>('http://localhost:1000/logo').subscribe({
      next: (res) => (this.logoUrl = res?.logoUrl ?? 'assets/logo.jpeg'),
      error: (_) => (this.logoUrl = 'assets/logo.jpeg'),
    });
  }

  async login() {
    this.errorMessage = '';
    if (!this.username || !this.password) {
      this.errorMessage = 'Please enter username and password';
      return;
    }

    this.loading = true;
    const body = { username: this.username, password: this.password };

    this.http
      .post<any>('http://localhost:1000/auth/login', body, {
        headers: { 'Content-Type': 'application/json' },
      })
      .subscribe({
        next: async (response) => {
          // backend returns { access_token: '...' } (nest/jwt default)
          const token = response?.access_token ?? response?.token ?? response?.accessToken ?? null;
          if (!token) {
            this.errorMessage = 'Login succeeded but token missing in response';
            console.error('login response missing token:', response);
            this.loading = false;
            return;
          }

          // Save token using your Angular AuthService
          await this.authSvc.saveTokens(token);

          console.log('Saved token:', token);
          this.loading = false;
          // Navigate to dashboard (change to /home if you prefer)
          this.router.navigateByUrl('/dashboard', { replaceUrl: true });
        },
        error: (err) => {
          console.error('Login failed:', err);
          this.errorMessage = err?.error?.message ?? 'Invalid username or password';
          // fallback message
          if (!this.errorMessage) this.errorMessage = 'Login failed';
          this.loading = false;
        },
      });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle() {
    alert('Google Login Clicked');
  }

  loginWithInstagram() {
    window.location.href = 'http://localhost:1000/instagram/login';
  }

  register() {
    this.router.navigate(['/registration']);
  }
}
