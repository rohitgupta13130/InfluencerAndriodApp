import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserProfile {
  id: number;
  fullName: string;
  userName: string;
  email: string;
  userTypeName: string;
  userTypeId: number;
  lastSeen: string | null;
  isOnline: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private readonly baseUrl = `${environment.apiBaseUrl}/user`;

  constructor(private http: HttpClient) {}

  // ================= GET USER BY ID =================
  getUserById(id: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}/${id}`);
  }
}