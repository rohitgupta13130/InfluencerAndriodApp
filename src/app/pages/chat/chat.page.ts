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
  selectedFullName: string = '';
  selectedUserName: string = '';
  selectedUser: any;
  avatar: string = '';          // your image (from dashboard)
  receiverAvatar: string = '';  // other user image
  userRole: string = '';

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

 ngOnInit() {
  this.senderId = Number(localStorage.getItem('userId'));
  this.userRole = localStorage.getItem('userRole') || 'user'; 

   this.avatar = localStorage.getItem('avatar') || 'https://i.pravatar.cc/100';

  if (!this.senderId) {
    this.router.navigate(['/login']);
    return;
  }

  // ✅ PRIMARY (first navigation)
  const nav = this.router.getCurrentNavigation();
  const user = nav?.extras?.state?.['user'];

  if (user) {
    this.selectedUser = user;
    this.selectedFullName = user.fullName || user.FullName;
    this.selectedUserName = user.userName || user.UserName;

    this.receiverAvatar = `https://i.pravatar.cc/100?u=${user.id || user.userId}`;
  }

  // ✅ BACKUP (after refresh)
  if (!this.selectedFullName && history.state.user) {
    const user = history.state.user;

    this.selectedFullName = user.fullName || user.FullName;
    this.selectedUserName = user.userName || user.UserName;

    this.receiverAvatar = `https://i.pravatar.cc/100?u=${user.id || user.userId}`;
  }

  this.route.paramMap.subscribe(params => {
    this.receiverId = Number(params.get('id'));
    this.loadMessages();
  });

  this.intervalId = setInterval(() => {
    this.loadMessages();
  }, 2000);
}

  // // ✅ LOAD CHAT
  // loadMessages() {
  //   this.chatService.getChat(this.receiverId).subscribe({
  //     next: (res) => {
  //       this.messages = res;

  //       // 🔽 Auto scroll
  //       setTimeout(() => {
  //         const el = document.querySelector('.chat-container');
  //         el?.scrollTo(0, (el as HTMLElement).scrollHeight);
  //       }, 100);
  //     },
  //     error: () => clearInterval(this.intervalId)
  //   });
  // }

  loadMessages() {
  this.chatService.getChat(this.receiverId).subscribe({
    next: (res) => {
      this.messages = res;

      // 🔥 MARK AS READ LOGIC
      this.messages.forEach(msg => {

        // ✅ Only messages RECEIVED by me
        if (msg.receiverId == this.senderId && !msg.isRead) {

          this.chatService.markAsRead(msg.id).subscribe({
            next: () => console.log('Marked Read:', msg.id),
            error: err => console.error('Read error:', err)
          });

        }

      });

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
  // minimizeChat() {
  //   this.router.navigate(['/influencer-dashboard']);
  // }

   minimizeChat() {
    // Check user role and navigate accordingly
    if (this.userRole === 'influencer') {
      this.router.navigate(['/influencer-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  handleKey(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    event.preventDefault(); // 🔥 important
    this.sendMessage();
  }
}
}