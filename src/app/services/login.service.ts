import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

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

  // ================= LOGIN =================
  login(data: {
    username: string;
    password: string;
  }): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(
        `${this.baseUrl}/login`,
        data
      )
      .pipe(
        tap((res: LoginResponse) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('userId', res.userId.toString());
          localStorage.setItem('userName', res.userName);
          localStorage.setItem('userType', res.userType);
        })
      );
  }

  // ================= LOGOUT =================
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userType');
  }

  // ================= TOKEN =================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ================= USER INFO =================
  getUserId(): number {
    return Number(localStorage.getItem('userId'));
  }

  getUserName(): string {
    return localStorage.getItem('userName') || '';
  }

  getUserType(): string {
    return localStorage.getItem('userType') || '';
  }

  // ================= AUTH CHECK =================
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}