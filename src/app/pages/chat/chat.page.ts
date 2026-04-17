import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../../services/chat';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
  IonFooter
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-chat',
  standalone: true,
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonInput,
    IonFooter,
    CommonModule,
    FormsModule
  ]
})
export class ChatPage implements OnInit, OnDestroy {

  messages: any[] = [];
  newMessage: string = '';

  receiverId!: number;
  senderId!: number;
  intervalId: any;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.senderId = Number(localStorage.getItem('userId'));

    if (!this.senderId) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      this.receiverId = Number(params.get('id'));
      this.loadMessages();
    });

    this.intervalId = setInterval(() => {
      this.loadMessages();
    }, 3000);
  }

  // ✅ LOAD CHAT
  loadMessages() {
    this.chatService.getChat(this.receiverId).subscribe({
      next: (res) => {
        this.messages = res;

        // 🔽 Auto scroll
        setTimeout(() => {
          const el = document.querySelector('.chat-container');
          el?.scrollTo(0, (el as HTMLElement).scrollHeight);
        }, 100);
      },
      error: () => clearInterval(this.intervalId)
    });
  }

  // ✅ SEND MESSAGE
  sendMessage() {
    if (!this.newMessage.trim()) return;

    const payload = {
      receiverId: this.receiverId,
      message: this.newMessage
    };

    this.chatService.sendMessage(payload).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadMessages();
      }
    });
  }

  // 🔥 MINIMIZE (GO TO DASHBOARD)
  minimizeChat() {
    this.router.navigate(['/dashboard']);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}