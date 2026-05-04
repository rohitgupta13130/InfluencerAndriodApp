import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

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

  //  private readonly baseUrl = 'https://localhost:7117/api/user';
    private readonly baseUrl = 'https://influencerapi-09to.onrender.com/api/user';

  constructor(private http: HttpClient) {}

  // ================= LOGIN =================
  login(data: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.baseUrl}/login`,
      data
    ).pipe(
      tap((res: LoginResponse) => {
        // ✅ Store token for interceptor
        localStorage.setItem('token', res.token);

        // ✅ Store user info (optional but useful)
        localStorage.setItem('userId', res.userId.toString());
        localStorage.setItem('userName', res.userName);
        localStorage.setItem('userType', res.userType);
      })
    );
  }

  // ================= LOGOUT (LOCAL) =================
  logout(): void {
    localStorage.clear();
  }

  // ================= GET TOKEN =================
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ================= CHECK LOGIN =================
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}