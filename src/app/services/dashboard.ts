import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  //  private readonly baseUrl = 'https://localhost:7117/api/dashboard';
  //  private readonly userUrl = 'https://localhost:7117/api/User';

    private readonly baseUrl = 'https://influencerapi-09to.onrender.com/api/dashboard';
    private readonly userUrl = 'https://influencerapi-09to.onrender.com/api/User';

  constructor(private http: HttpClient) {}

  // ================= DASHBOARD =================
  getDashboard(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // ================= GET USERS =================
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.userUrl}/GetAllUsers`);
  }

  // ================= LOGOUT =================
  logout(userId: number): Observable<string> {

    const params = new HttpParams().set('userId', userId.toString());

    return this.http.post<string>(
      `${this.userUrl}/Logout`,
      {}, // empty body
      {
        params,
        responseType: 'text' as 'json'
      }
    );
  }
}