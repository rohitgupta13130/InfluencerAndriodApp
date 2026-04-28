import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { CommonModule } from '@angular/common';
import { chatbubbleEllipsesOutline } from 'ionicons/icons';
import { jwtDecode } from 'jwt-decode';


import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,

  IonLabel,
  IonItem,
  IonList
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { logOutOutline, menuOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    CommonModule,
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
  
  

  constructor(
    private router: Router,
    private dashboardService: DashboardService,
   
  ) {
    addIcons({
      logOutOutline,
      menuOutline,
      chatbubbleEllipsesOutline
    });
  }

  // ngOnInit() {

  //   const name = localStorage.getItem('fullName'); // if stored
  //   this.fullName = name || '';

  //   // const username = localStorage.getItem('userName');
  //   // this.userName = username ? this.formatName(username) : 'User';

  //   this.loadDashboard();
  //   this.loadUsers();
  // }

  ngOnInit() {

  const token = localStorage.getItem('token');

  if (token) {
    const decoded: any = jwtDecode(token);

    console.log('Decoded Token:', decoded);

    this.fullName = decoded.FullName; // ✅ GET FULL NAME
    this.userName = decoded.UserName; // optional
  }

  this.loadDashboard();
  this.loadUsers();
}

  loadDashboard() {
    this.dashboardService.getDashboard().subscribe({
      next: (res) => {
        //console.log('Dashboard API:', res);
        this.dashboardData = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Dashboard Error:', err);
        this.isLoading = false;
      }
    });
  }

  formatName(email: string): string {
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }

  formatNumber(num: number): string {
    if (!num) return '0';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  }

  // logout() {
  //   localStorage.clear();
  //   this.router.navigate(['/login'], { replaceUrl: true });
  // }

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

  // openChat(userId: number) {
  // this.router.navigate(['/chat', userId]);  // 👈 pass receiverId

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



}