import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  //private baseUrl = 'https://localhost:7117/api/chat';

  private baseUrl = 'https://influencerapi-09to.onrender.com/api/chat';

  constructor(private http: HttpClient) {}

  // ✅ GET CHAT
  getChat(receiverId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}?receiverId=${receiverId}`,
      { withCredentials: true } // 🔥 IMPORTANT (cookie auth)
    );
  }

  // ✅ SEND MESSAGE
  sendMessage(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}`,
      data,
      { withCredentials: true } // 🔥 IMPORTANT
    );
  }

  markAsRead(messageId: number) {
  return this.http.patch(
    //`https://localhost:7117/api/chat/read/${messageId}`,
     `https://influencerapi-09to.onrender.com/api/chat/read/${messageId}`,
    {},
    { withCredentials: true }
  );
}
}