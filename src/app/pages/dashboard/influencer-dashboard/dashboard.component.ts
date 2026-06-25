import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../../services/dashboard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environment';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonIcon,
  IonLabel,
  IonItem,
  IonList,
  IonAvatar,
  IonBadge
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  logOutOutline, 
  menuOutline, 
  chatbubbleEllipsesOutline,
  notificationsOutline,
  searchOutline,
  homeOutline,
  compassOutline,
  chatbubbleOutline,
  bookmarkOutline,
  settingsOutline,
  personOutline,
  peopleOutline,
  trendingUpOutline,
  briefcaseOutline,
  starOutline,
  helpCircleOutline
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
    IonList,
    IonAvatar,
    IonBadge
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
  isSidebarHidden: boolean = true;
  userProfilePic: string = 'assets/default-avatar.png';
  searchText: string = '';
  currentUser: any = null;
  userId: string | null = null;
  defaultAvatar: string = 'assets/default-avatar.png';
  activeMenu: string = 'home';
  notificationCount: number = 3;

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
  ) {
    addIcons({
      logOutOutline,
      menuOutline,
      chatbubbleEllipsesOutline,
      notificationsOutline,
      searchOutline,
      homeOutline,
      compassOutline,
      chatbubbleOutline,
      bookmarkOutline,
      settingsOutline,
      personOutline,
      peopleOutline,
      trendingUpOutline,
      briefcaseOutline,
      starOutline,
      helpCircleOutline
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded: any = jwtDecode(token);
      console.log('Decoded Token:', decoded);
      this.fullName = decoded.FullName || decoded.fullName || '';
      this.userName = decoded.UserName || decoded.userName || decoded.email || '';
      this.userId = decoded.UserId || decoded.userId || decoded.sub || null;
      
      this.loadCurrentUserProfile();
    }

    this.loadDashboard();
    this.loadUsers();
  }

  loadCurrentUserProfile() {
    if (this.userId) {
      this.dashboardService.getUsers().subscribe({
        next: (users: any[]) => {
          const currentUser = users.find(user => 
            user.id === Number(this.userId) || 
            user.userId === Number(this.userId) ||
            user.email === this.userName ||
            user.userName === this.userName
          );
          
          if (currentUser) {
            this.currentUser = currentUser;
            if (currentUser.profileImage) {
              this.userProfilePic = this.getFullImageUrl(currentUser.profileImage);
            }
            console.log('Profile image URL:', this.userProfilePic);
          }
        },
        error: (err) => {
          console.error('Error loading profile:', err);
        }
      });
    } else {
      this.dashboardService.getUsers().subscribe({
        next: (users: any[]) => {
          const currentUser = users.find(user => 
            user.email === this.userName || 
            user.userName === this.userName
          );
          
          if (currentUser && currentUser.profileImage) {
            this.userProfilePic = this.getFullImageUrl(currentUser.profileImage);
          }
        },
        error: (err) => {
          console.error('Error loading profile:', err);
        }
      });
    }
  }

  getFullImageUrl(imagePath: string): string {
    if (!imagePath) {
      return this.defaultAvatar;
    }
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    const baseUrl = environment.apiBaseUrl.replace('/api', '');
    return `${baseUrl}/${cleanPath}`;
  }

  getUserProfilePic(user: any): string {
    if (user?.profileImage) {
      return this.getFullImageUrl(user.profileImage);
    }
    return this.defaultAvatar;
  }

  handleImageError(event: any) {
    event.target.src = this.defaultAvatar;
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

  logout(): void {
    const userIdStr = localStorage.getItem('userId');

    if (!userIdStr) {
      localStorage.clear();
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    const userId = Number(userIdStr);

    this.dashboardService.logout(userId).subscribe({
      next: (response) => {
        console.log('Logout response:', response);
        localStorage.clear();
        this.router.navigate(['/login'], { replaceUrl: true });
      },
      error: (err) => {
        console.error('Logout error:', err);
        localStorage.clear();
        this.router.navigate(['/login'], { replaceUrl: true });
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
    this.router.navigate(['/notifications']);
  }

  navigate(page: string) {
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

  filterInfluencers() {
    // Optional: implement search functionality
  }
}