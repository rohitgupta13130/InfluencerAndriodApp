import { Component } from '@angular/core';
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
export class DashboardComponent {

  constructor(private router: Router) {

    addIcons({
      logOutOutline,
      menuOutline
    });
  }

  logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');

  this.router.navigate(['/login'], { replaceUrl: true });
}
}