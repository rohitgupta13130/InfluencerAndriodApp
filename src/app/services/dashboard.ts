import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private readonly dashboardUrl = `${environment.apiBaseUrl}/dashboard`;
  private readonly userUrl = `${environment.apiBaseUrl}/User`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<any> {
    return this.http.get<any>(this.dashboardUrl);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.userUrl}/GetAllUsers`);
  }

  logout(userId: number): Observable<string> {
    const params = new HttpParams()
      .set('userId', userId.toString());

    return this.http.post<string>(
      `${this.userUrl}/Logout`,
      {},
      {
        params,
        responseType: 'text' as 'json'
      }
    );
  }
}