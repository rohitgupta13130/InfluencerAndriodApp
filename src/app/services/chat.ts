import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export interface ChatMessage {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private readonly baseUrl = `${environment.apiBaseUrl}/chat`;

  constructor(private http: HttpClient) { }

  // ================= GET CHAT =================
  getChat(receiverId: number): Observable<ChatMessage[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.get<ChatMessage[]>(this.baseUrl, {
      headers: headers,
      params: {
        receiverId: receiverId.toString()
      }
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ================= SEND MESSAGE =================
  sendMessage(payload: {
    senderId: number;
    receiverId: number;
    message: string;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    console.log('📤 Sending payload:', payload);

    return this.http.post(this.baseUrl, payload, {
      headers: headers
    }).pipe(
      catchError(this.handleError)
    );
  }

  // ================= MARK AS READ =================
  markAsRead(messageId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.patch<void>(
      `${this.baseUrl}/read/${messageId}`,
      {},
      { headers: headers }
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ================= ERROR HANDLER =================
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || `Error Code: ${error.status}`;
    }
    
    console.error('❌ Chat Service Error:', errorMessage);
    console.error('Full error:', error);
    
    return throwError(() => new Error(errorMessage));
  }
}