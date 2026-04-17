import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from '../../services/dashboard';
import { CommonModule } from '@angular/common';
import { chatbubbleEllipsesOutline } from 'ionicons/icons';


import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonInput,
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
    IonInput,
    IonItem,
    IonList
   
  
  ],

  
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userName: string = '';
  FullName: string ='';
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

  ngOnInit() {
    const name = localStorage.getItem('userName');
    this.userName = name ? this.formatName(name) : 'User';

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

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  openChat(userId: number) {
  this.router.navigate(['/chat', userId]);  // 👈 pass receiverId
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