import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

// ================= REQUEST MODELS =================
export interface RegisterRequest {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  userType: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// ================= RESPONSE MODEL =================
export interface LoginResponse {
  token: string;
  userId: number;
  userName: string;
  userType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl = `${environment.apiBaseUrl}/user`;

  constructor(private http: HttpClient) {}

  // ================= REGISTER =================
  register(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/Register`, data);
  }

  // ================= LOGIN =================
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      data
    ).pipe(
      tap((res: LoginResponse) => this.setSession(res))
    );
  }

  // ================= SESSION HANDLING =================
  private setSession(res: LoginResponse): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('userId', res.userId.toString());
    localStorage.setItem('userName', res.userName);
    localStorage.setItem('userType', res.userType);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
  }

  // ================= HELPERS =================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}