import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonList
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  logOutOutline, 
  menuOutline, 
  chatbubbleEllipsesOutline,
  notificationsOutline,
  searchOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonIcon,
    CommonModule,
    FormsModule,
    IonLabel,
    IonItem,
    IonList
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userName: string = '';
  fullName: string = ''; 
  dashboardData: any;
  isLoading: boolean = true;
  users: any[] = [];
  isChatOpen: boolean = false;
  isSidebarHidden: boolean = true; // default hidden for mobile UX
  userProfilePic: string = 'https://i.pravatar.cc/40?img=1';
  searchText: string = '';

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) {
    addIcons({
      logOutOutline,
      menuOutline,
      chatbubbleEllipsesOutline,
      notificationsOutline,
      searchOutline
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);
      console.log('Decoded Token:', decoded);
      this.fullName = decoded.FullName;
      this.userName = decoded.UserName;
    }

    this.loadDashboard();
    this.loadUsers();
  }

  loadDashboard() {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        this.dashboardData = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.isLoading = false;
      }
    });
  }

  formatNumber(num: number): string {
    if (!num) return '0';
    if (num >= 1000) return (num.toFixed(1)) + 'K';
    return num.toString();
  }

  logout() {
    const userId = localStorage.getItem('userId');

    this.dashboardService.logout(userId).subscribe({
      next: () => {
        localStorage.clear();
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (err) => {
        console.error('Logout error:', err);
      }
    });
  }

  openChat(user: any) {
    console.log('Clicked user:', user);
    const id = user.id || user.userId;

    if (!id) {
      console.error('❌ ID missing:', user);
      return;
    }

    this.router.navigate(['/chat', id], {
      state: { user }
    });
  }

  loadUsers() {
    this.dashboardService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        console.log('Users:', res);
      },
      error: (err) => {
        console.error('User load error:', err);
      }
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  openNotifications() {
    console.log('🔔 Notification clicked');
  }

  navigate(page: string) {
    const routes: any = {
      home: '/dashboard',
      explore: '/explore',
      messages: '/messages'
    };

    const route = routes[page];
    if (route) {
      this.router.navigate([route]);
    } else {
      console.warn('⚠ Unknown route:', page);
    }
  }

  filterInfluencers() {
    // Optional: implement search functionality
  }
}