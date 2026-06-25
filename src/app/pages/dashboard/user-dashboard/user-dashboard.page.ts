import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

import {
  IonButton,
  IonIcon,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar,
  IonSpinner,
  IonBadge
} from '@ionic/angular/standalone';

import { DashboardService } from '../../../services/dashboard';
import { environment } from '../../../../environments/environment';

import { addIcons } from 'ionicons';
import {
  menuOutline,
  searchOutline,
  notificationsOutline,
  logOutOutline,
  personOutline,
  peopleOutline,
  chatbubbleOutline,
  alertCircleOutline,
  homeOutline,
  compassOutline,
  bookmarkOutline,
  settingsOutline,
  chatbubbleEllipsesOutline,
  heartOutline,
  trendingUpOutline
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
    IonTitle,
    IonAvatar,
    IonSpinner,
    IonBadge
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
  loading: boolean = false;
  error: string | null = null;
  activeMenu: string = 'explore';
  notificationCount: number = 5;
  messageCount: number = 12;
  isMobile: boolean = false;
  isMobileSearchVisible: boolean = false;
  
  // Current user data
  currentUser: any = null;
  userProfilePic: string = 'assets/default-avatar.png';
  defaultAvatar: string = 'assets/default-avatar.png';
  
  // API Base URL for images
  private apiBaseUrl: string = environment.apiBaseUrl.replace('/api', '');

  // ================= CONSTRUCTOR =================
  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) {
    this.registerIcons();
    this.loadCurrentUser();
    this.checkScreenSize();
  }

  // ================= LIFECYCLE =================
  ngOnInit(): void {
    this.loadUsers();
  }

  // ================= SCREEN SIZE DETECTION =================
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
    if (!this.isMobile) {
      this.isMobileSearchVisible = false;
    }
  }

  toggleSearch() {
    this.isMobileSearchVisible = !this.isMobileSearchVisible;
  }

  // ================= INIT HELPERS =================
  private registerIcons(): void {
    addIcons({
      menuOutline,
      searchOutline,
      notificationsOutline,
      logOutOutline,
      personOutline,
      peopleOutline,
      chatbubbleOutline,
      alertCircleOutline,
      homeOutline,
      compassOutline,
      bookmarkOutline,
      settingsOutline,
      chatbubbleEllipsesOutline,
      heartOutline,
      trendingUpOutline
    });
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        console.log('Decoded Token:', decoded);
        
        this.currentUser = {
          fullName: decoded.FullName || decoded.fullName || '',
          userName: decoded.UserName || decoded.userName || '',
          email: decoded.Email || decoded.email || '',
          id: decoded.UserId || decoded.userId || decoded.sub || null,
          userTypeName: decoded.UserTypeName || decoded.userTypeName || 'User',
          profileImage: decoded.ProfileImage || decoded.profileImage || null
        };

        if (this.currentUser.profileImage) {
          this.userProfilePic = this.getFullImageUrl(this.currentUser.profileImage);
        }
        
        console.log('Current User:', this.currentUser);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  // ================= IMAGE HELPERS =================
  getFullImageUrl(imagePath: string | null | undefined): string {
    if (!imagePath) {
      return this.defaultAvatar;
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${this.apiBaseUrl}/${cleanPath}`;
  }

  getUserImage(user: any): string {
    if (user?.profileImage) {
      return this.getFullImageUrl(user.profileImage);
    }
    return this.defaultAvatar;
  }

  handleImageError(event: any, user?: any): void {
    event.target.src = this.defaultAvatar;
    if (user) {
      user.profileImage = null;
    }
  }

  getUserRoleDisplay(): string {
    return this.currentUser?.userTypeName || 'User';
  }

  // ================= API =================
  loadUsers(): void {
    this.loading = true;
    this.error = null;
    
    this.dashboardService.getUsers().subscribe({
      next: (res: any[]) => {
        this.users = res || [];
        this.filteredUsers = [...this.users];
        this.loading = false;
        console.log('✅ Users loaded:', this.users.length);
      },
      error: (err) => {
        console.error('❌ User load error:', err);
        this.error = 'Failed to load influencers. Please try again.';
        this.loading = false;
      }
    });
  }

  // ================= SEARCH =================
  filterInfluencers(): void {
    const text = this.searchText?.toLowerCase().trim() || '';
    if (!text) {
      this.filteredUsers = [...this.users];
      return;
    }
    
    this.filteredUsers = this.users.filter(user => {
      const name = (user.fullName || user.userName || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      return name.includes(text) || email.includes(text);
    });
  }

  // ================= UI ACTIONS =================
  toggleSidebar(): void {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

  openNotifications(): void {
    console.log('🔔 Notification clicked');
    this.router.navigate(['/notifications']);
  }

  // ================= NAVIGATION =================
  navigate(page: string): void {
    this.activeMenu = page;
    this.isSidebarHidden = true;
    
    const routes: any = {
      home: '/dashboard',
      explore: '/explore',
      messages: '/messages',
      saved: '/saved',
      settings: '/settings',
      profile: '/profile'
    };

    const route = routes[page];
    if (route) {
      this.router.navigate([route]);
    } else {
      console.warn('⚠ Unknown route:', page);
    }
  }

  openProfile(user: any): void {
    const id = user?.id || user?.userId;
    if (!id) {
      console.error('❌ Missing user ID');
      return;
    }
    this.isSidebarHidden = true;
    this.router.navigate(['/profile', id]);
  }

  openChat(user: any): void {
    const id = user?.id || user?.userId;
    if (!id) {
      console.error('❌ Missing user ID:', user);
      return;
    }
    this.isSidebarHidden = true;
    this.router.navigate(['/chat', id], {
      state: { user }
    });
  }

  // ================= UI HELPERS =================
  formatNumber(num: number): string {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  // ================= AUTH =================
  logout(): void {
    const userIdStr = localStorage.getItem('userId');
    if (userIdStr) {
      const userId = Number(userIdStr);
      this.dashboardService.logout(userId).subscribe({
        next: () => {
          localStorage.clear();
          this.router.navigate(['/login'], { replaceUrl: true });
        },
        error: () => {
          localStorage.clear();
          this.router.navigate(['/login'], { replaceUrl: true });
        }
      });
    } else {
      localStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
    }
  }
}