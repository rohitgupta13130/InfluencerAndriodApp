import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../services/chat';
import { environment } from 'src/environments/environment';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonInput,
  IonFooter,
  IonIcon,
  IonAvatar,
  IonToast
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  arrowBackOutline,
  sendOutline
} from 'ionicons/icons';

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
    IonIcon,
    IonAvatar,
    IonToast,
    CommonModule,
    FormsModule
  ]
})
export class ChatPage implements OnInit, OnDestroy {

  @ViewChild('chatContainer') chatContainer!: ElementRef;

  messages: any[] = [];
  newMessage: string = '';
  receiverId!: number;
  senderId: number = 0;
  selectedFullName: string = '';
  selectedUserName: string = '';
  selectedUser: any = null;
  receiverAvatar: string = 'assets/default-avatar.png';
  userRole: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  showToast: boolean = false;
  toastMessage: string = '';
  toastColor: string = 'danger';
  intervalId: any;
  defaultAvatar: string = 'assets/default-avatar.png';
  private apiBaseUrl: string = environment.apiBaseUrl.replace('/api', '');

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    addIcons({
      arrowBackOutline,
      sendOutline
    });
  }

  ngOnInit() {
    console.log('🔵 ===== CHAT PAGE INITIALIZED =====');
    
    // Get sender ID
    this.senderId = Number(localStorage.getItem('userId')) || 0;
    this.userRole = localStorage.getItem('userRole') || 'user';

    console.log('🔵 Sender ID:', this.senderId);
    console.log('🔵 User Role:', this.userRole);

    if (!this.senderId) {
      this.router.navigate(['/login']);
      return;
    }

    // METHOD 1: Get user from navigation state
    const navigation = this.router.getCurrentNavigation();
    console.log('🔵 Navigation object:', navigation);
    
    const userFromState = navigation?.extras?.state?.['user'];
    console.log('🔵 User from state:', userFromState);

    // METHOD 2: Get user from history state
    const userFromHistory = history.state?.user;
    console.log('🔵 User from history:', userFromHistory);

    // METHOD 3: Get user from localStorage
    let userFromStorage = null;
    try {
      const storedUser = localStorage.getItem('chatUser');
      if (storedUser) {
        userFromStorage = JSON.parse(storedUser);
        console.log('🔵 User from localStorage:', userFromStorage);
        localStorage.removeItem('chatUser');
      }
    } catch (e) {
      console.warn('Could not retrieve user from localStorage:', e);
    }

    // Use whichever has data
    const user = userFromState || userFromHistory || userFromStorage;

    if (user) {
      this.selectedUser = user;
      this.selectedFullName = user.fullName || user.FullName || '';
      this.selectedUserName = user.userName || user.UserName || '';
      this.receiverAvatar = this.getUserImage(user);
      this.receiverId = user.id || user.userId;
      console.log('✅ User found:', this.selectedFullName, 'ID:', this.receiverId);
    } else {
      console.warn('⚠️ No user data found in any source');
      this.showToastMessage('No user data found', 'warning');
    }

    // Get receiver ID from route params
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      console.log('🔵 Route param ID:', id);
      
      if (id) {
        const routeId = Number(id);
        if (!this.receiverId) {
          this.receiverId = routeId;
          console.log('✅ Receiver ID from route:', this.receiverId);
        }
        this.loadMessages();
      }
    });

    // Poll for messages
    this.intervalId = setInterval(() => {
      if (this.receiverId) {
        this.loadMessages();
      }
    }, 3000);
  }

  getUserImage(user: any): string {
    if (user?.profileImage) {
      if (user.profileImage.startsWith('http://') || user.profileImage.startsWith('https://')) {
        return user.profileImage;
      }
      const cleanPath = user.profileImage.startsWith('/') ? user.profileImage.substring(1) : user.profileImage;
      return `${this.apiBaseUrl}/${cleanPath}`;
    }
    return this.defaultAvatar;
  }

  loadMessages() {
    if (!this.receiverId) {
      console.warn('⚠️ No receiver ID to load messages');
      return;
    }

    console.log('🔄 Loading messages for receiver:', this.receiverId);

    this.chatService.getChat(this.receiverId).subscribe({
      next: (res) => {
        this.messages = res || [];
        console.log('✅ Messages loaded:', this.messages.length);
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('❌ Load messages error:', err);
        this.showToastMessage('Failed to load messages', 'danger');
      }
    });
  }

  sendMessage() {
    const message = this.newMessage?.trim();
    if (!message) {
      return;
    }

    if (!this.senderId || !this.receiverId) {
      this.showToastMessage('Missing sender or receiver ID', 'danger');
      return;
    }

    const payload = {
      senderId: this.senderId,
      receiverId: this.receiverId,
      message: message
    };

    console.log('📤 Sending payload:', payload);

    this.isLoading = true;

    this.chatService.sendMessage(payload).subscribe({
      next: (response) => {
        console.log('✅ Message sent:', response);
        this.newMessage = '';
        this.isLoading = false;
        this.loadMessages();
        this.showToastMessage('Message sent!', 'success');
      },
      error: (err) => {
        console.error('❌ Send error:', err);
        this.isLoading = false;
        this.showToastMessage('Failed to send message', 'danger');
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      try {
        if (this.chatContainer) {
          const element = this.chatContainer.nativeElement;
          element.scrollTop = element.scrollHeight;
        }
      } catch (err) {
        console.error('Scroll error:', err);
      }
    }, 100);
  }

  showToastMessage(message: string, color: string = 'danger') {
    this.toastMessage = message;
    this.toastColor = color;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  minimizeChat() {
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
}