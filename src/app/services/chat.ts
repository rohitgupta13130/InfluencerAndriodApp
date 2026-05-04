import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

 // private readonly baseUrl = 'https://localhost:7117/api/chat';
  private readonly baseUrl = 'https://influencerapi-09to.onrender.com/api/chat'

  constructor(private http: HttpClient) {}

  // ================= GET CHAT =================
  getChat(receiverId: number): Observable<ChatMessage[]> {
    return this.http.get<ChatMessage[]>(`${this.baseUrl}`, {
      params: { receiverId: receiverId.toString() }
    });
  }

  // ================= SEND MESSAGE (FIXED) =================
  sendMessage(payload: { receiverId: number; message: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}`, payload);
  }

  // ================= MARK AS READ =================
  markAsRead(messageId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/read/${messageId}`, {});
  }
}