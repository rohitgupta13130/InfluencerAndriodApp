import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  IonButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle
} from '@ionic/angular/standalone';

import { DashboardService } from '../../../services/dashboard';

import { addIcons } from 'ionicons';
import {
  menuOutline,
  searchOutline,
  notificationsOutline,
  logOutOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonButton,
    IonIcon,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle
  ],
  templateUrl: './user-dashboard.page.html',
  styleUrls: ['./user-dashboard.page.scss']
})
export class UserDashboardPage implements OnInit {

  // ================= STATE =================
  users: any[] = [];
  filteredUsers: any[] = [];
  searchText: string = '';
  isSidebarHidden: boolean = true;
  userProfilePic: string = 'https://i.pravatar.cc/40?img=1';

  // ================= CONSTRUCTOR =================
  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {
    this.registerIcons();
  }

  // ================= LIFECYCLE =================
  ngOnInit(): void {
    this.loadUsers();
  }

  // ================= INIT HELPERS =================
  private registerIcons(): void {
    addIcons({
      menuOutline,
      searchOutline,
      notificationsOutline,
      logOutOutline
    });
  }
  
  // ================= API =================
  loadUsers(): void {
    this.dashboardService.getUsers().subscribe({
      next: (res: any[]) => {
        this.users = res || [];
        this.filteredUsers = [...this.users];
      },
      error: (err) => {
        console.error('❌ User load error:', err);
      }
    });
  }

  // ================= SEARCH =================
  filterInfluencers(): void {
    const text = this.searchText?.toLowerCase().trim() || '';
    this.filteredUsers = this.users.filter(user => {
      const name = (user.fullName || user.userName || '').toLowerCase();
      return name.includes(text);
    });
  }

  // ================= UI ACTIONS =================
  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  openNotifications(): void {
    console.log('🔔 Notification clicked');
  }

  // ================= NAVIGATION =================
  navigate(page: string): void {
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

  // ================= PROFILE NAVIGATION =================
  openProfile(user: any): void {
    // Check token before navigation
    const token = localStorage.getItem('token');
    console.log('Token before profile navigation:', token);
    
    if (!token) {
      console.error('No token found, redirecting to login');
      this.router.navigate(['/login']);
      return;
    }
    
    // Get user ID from the user object
    const id = user?.id || user?.userId;
    console.log('Navigating to profile with ID:', id);
    
    if (!id) {
      console.error('❌ Missing user ID:', user);
      // Show error toast or alert
      return;
    }
    
    // Add small delay to prevent routing issues
    setTimeout(() => {
      this.router.navigate(['/profile', id]);
    }, 100);
  }

  // ================= CHAT NAVIGATION =================
  openChat(user: any): void {
    const id = user?.id || user?.userId;
    if (!id) {
      console.error('❌ Missing user ID:', user);
      return;
    }
    
    this.router.navigate(['/chat', id], {
      state: { user }
    });
  }

  // ================= UI HELPERS =================
  getUserImage(user: any): string {
    const id = user?.id || user?.userId || Math.floor(Math.random() * 70);
    return `https://i.pravatar.cc/150?img=${id}`;
  }

  formatNumber(num: number): string {
    if (!num) return '0';
    return num >= 1000 ? (num / 1000).toFixed(1) + 'K' : num.toString();
  }

  // ================= AUTH =================
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}