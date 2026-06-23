import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.http.get<ChatMessage[]>(this.baseUrl, {
      params: {
        receiverId: receiverId.toString()
      }
    });
  }

  // ================= SEND MESSAGE =================
  sendMessage(payload: {
    receiverId: number;
    message: string;
  }): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }

  // ================= MARK AS READ =================
  markAsRead(messageId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}/read/${messageId}`,
      {}
    );
  }
}