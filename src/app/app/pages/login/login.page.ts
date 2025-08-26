import { Component, OnInit,inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem,IonImg,
  IonLabel, IonList, IonText, IonIcon} from '@ionic/angular/standalone';
  import { Router } from '@angular/router';
import { personCircleOutline, lockClosedOutline, logInOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle,IonList, IonLabel,IonButton,IonToolbar,IonInput,IonItem,IonText, IonIcon,CommonModule, FormsModule,IonImg]
})
export class LoginPage implements OnInit {

    username = '';
  password = '';
  constructor() { }

  ngOnInit() {
  }

    loginWithGoogle() {
    alert('Google Login Clicked');
  }

    loginWithInstagram() {
    alert('Instagram Login Clicked');
  }

  loginClick() {
    console.log('Login clicked:', this.username, this.password);
    alert(`Welcome ${this.username || 'User'}!`);
  }

}
