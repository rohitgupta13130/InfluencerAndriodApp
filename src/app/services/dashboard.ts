import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

   // private baseUrl = 'https://localhost:7117/api/Dashboard';
   // private userUrl = 'https://localhost:7117/api/user'; 
    private userUrl = 'https://influencerapi-09to.onrender.com/api/user'
    private baseUrl = 'https://influencerapi-09to.onrender.com/api/dashboard';

  constructor(private http: HttpClient) {}

  // getDashboard(): Observable<any> {

  //   const token = localStorage.getItem('token');

  //   const headers = new HttpHeaders({
  //     Authorization: `Bearer ${token}`
  //   });

  //   return this.http.get(this.baseUrl, { headers });
  // }

  getDashboard(): Observable<any> {
  return this.http.get(
    this.baseUrl,
    {
      withCredentials: true // 🔥 MOST IMPORTANT
    }
  );
}

  getUsers(): Observable<any[]> {
  return this.http.get<any[]>(
   // 'https://localhost:7117/api/User/GetAllUsers'
    'https://influencerapi-09to.onrender.com/api/User/GetAllUsers'
  );
}

logout(userId: any) {
  return this.http.post(
   // `https://localhost:7117/api/User/Logout?userId=${userId}`,
    `https://influencerapi-09to.onrender.com/api/User/Logout?userId=${userId}`,
    {},
    { responseType: 'text' } // ✅ IMPORTANT
  );
}

}