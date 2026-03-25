import { Component, OnInit } from '@angular/core';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { logOutOutline, menuOutline } from 'ionicons/icons';
import { Router } from '@angular/router';

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
    IonIcon
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  userName: string = '';


  constructor(private router: Router) {
  
    
    addIcons({
      logOutOutline,
      menuOutline
    });
  }

  ngOnInit() {
    const name = localStorage.getItem('userName');
    this.userName = name ? this.formatName(name) : 'User';
  }

  formatName(email: string): string {
    // Convert "navink@gmail.com" → "Navink"
    const namePart = email.split('@')[0];
    return namePart.charAt(0).toUpperCase() + namePart.slice(1);
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');

  this.router.navigate(['/login'], { replaceUrl: true });
}
}