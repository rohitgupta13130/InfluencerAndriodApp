// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

const ACCESS_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor() {}

  async saveTokens(accessToken: string, refreshToken?: string): Promise<void> {
    localStorage.setItem(ACCESS_KEY, accessToken);
    if (refreshToken) localStorage.setItem(REFRESH_KEY, refreshToken);
  }

  async getAccessToken(): Promise<string | null> {
    return localStorage.getItem(ACCESS_KEY);
  }

  async getRefreshToken(): Promise<string | null> {
    return localStorage.getItem(REFRESH_KEY);
  }

  async isLoggedIn(): Promise<boolean> {
    return !!(await this.getAccessToken());
  }

  async clearTokens(): Promise<void> {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

  // demo login (for local dev). Replace with real HTTP call when backend available.
  async demoLogin(): Promise<void> {
    const fakeAccess = 'demo-' + Math.random().toString(36).slice(2);
    await this.saveTokens(fakeAccess, 'demo-refresh');
  }
}
