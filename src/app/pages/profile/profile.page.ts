import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonButton,
  IonIcon,
  IonAvatar,
  IonBadge,
  IonSpinner,
  IonFab,
  IonFabButton
} from '@ionic/angular/standalone';

import { ProfileService } from '../../services/profile';
import { DashboardService } from '../../services/dashboard';
import { environment } from 'src/environments/environment';

import { addIcons } from 'ionicons';
import {
  logOutOutline,
  chatbubbleOutline,
  arrowBackOutline,
  mailOutline,
  callOutline,
  locationOutline,
  globeOutline,
  calendarOutline,
  personOutline,
  peopleOutline,
  createOutline,
  shareSocialOutline,
  linkOutline,
  checkmarkCircleOutline,
  timeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    IonButton,
    IonIcon,
    IonAvatar,
    IonBadge,
    IonSpinner,
    IonFab,
    IonFabButton,

  ],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

  user: any = null;
  userId!: number;
  isLoading: boolean = true;
  isCurrentUser: boolean = false;
  currentUserId: number | null = null;
  defaultAvatar: string = 'assets/default-avatar.png';
  private apiBaseUrl: string = environment.apiBaseUrl.replace('/api', '');
  
  // Stats
  stats = {
    followers: 0,
    following: 0,
    posts: 0,
    engagement: 0
  };

  // Social Links
  socialLinks = [
    { name: 'Instagram', icon: 'logo-instagram', url: '' },
    { name: 'Twitter', icon: 'logo-twitter', url: '' },
    { name: 'YouTube', icon: 'logo-youtube', url: '' },
    { name: 'TikTok', icon: 'logo-tiktok', url: '' }
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private profileService: ProfileService,
    private dashboardService: DashboardService
  ) {
    this.registerIcons();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      console.error('❌ No ID in route');
      this.router.navigate(['/user-dashboard']);
      return;
    }

    this.userId = Number(id);
    console.log('User ID:', this.userId);
    
    this.loadCurrentUser();
    this.loadProfile();
  }

  private registerIcons(): void {
    addIcons({
      logOutOutline,
      chatbubbleOutline,
      arrowBackOutline,
      mailOutline,
      callOutline,
      locationOutline,
      globeOutline,
      calendarOutline,
      personOutline,
      peopleOutline,
      createOutline,
      shareSocialOutline,
      linkOutline,
      checkmarkCircleOutline,
      timeOutline
    });
  }

  private loadCurrentUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        this.currentUserId = decoded.UserId || decoded.userId || decoded.sub || null;
        console.log('Current User ID:', this.currentUserId);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }

  loadProfile(): void {
    this.isLoading = true;
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('❌ Token missing');
      this.isLoading = false;
      this.router.navigate(['/login']);
      return;
    }

    this.profileService.getUserById(this.userId).subscribe({
      next: (res: any) => {
        console.log('✅ Profile Data:', res);
        this.user = res;
        this.isCurrentUser = this.currentUserId === this.userId;
        
        // Load stats
        this.loadStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Profile error:', err);
        this.isLoading = false;
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  loadStats(): void {
    // You can fetch real stats from API
    // For now using mock data or data from user object
    this.stats = {
      followers: this.user?.followers || Math.floor(Math.random() * 10000) + 1000,
      following: this.user?.following || Math.floor(Math.random() * 500) + 100,
      posts: this.user?.posts || Math.floor(Math.random() * 200) + 10,
      engagement: this.user?.engagement || Math.floor(Math.random() * 10) + 5
    };
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

  handleImageError(event: any): void {
    event.target.src = this.defaultAvatar;
  }

  // ================= FORMAT HELPERS =================
  formatNumber(num: number): string {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  getJoinedDate(): string {
    if (this.user?.createdDate) {
      return new Date(this.user.createdDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    }
    if (this.user?.joinedDate) {
      return new Date(this.user.joinedDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
    }
    return 'Recently';
  }

  getInitials(): string {
    if (!this.user?.fullName) return 'U';
    const names = this.user.fullName.split(' ');
    return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  // ================= ACTIONS =================
  openChat(): void {
    if (this.user) {
      this.router.navigate(['/chat', this.userId], {
        state: { user: this.user }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/user-dashboard']);
  }

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

  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }

  shareProfile(): void {
    // Implement share functionality
    console.log('Share profile');
  }
}