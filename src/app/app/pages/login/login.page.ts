import { Component, OnInit,inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonTitle, IonButton, IonInput, IonItem,IonImg,
  IonLabel, IonList, IonText, IonIcon} from '@ionic/angular/standalone';
  import { Router } from '@angular/router';
import { personCircleOutline, lockClosedOutline, logInOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
 import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle,IonList, IonLabel,IonButton,IonToolbar,IonInput,IonItem,IonText, IonIcon,CommonModule, FormsModule,IonImg]
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  constructor(private http: HttpClient,private router: Router) { }

  ngOnInit() {
  }

    login() {
       const body = {username: this.username,password: this.password};
       console.log(this.username + '' + this.password );
       this.http.post<any>('http://127.0.0.1:3000/auth/login', body, {
      headers: { 'Content-Type': 'application/json' }
    })
    .subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('authToken', token);
        console.log('Bearer Token:', token);
        alert('Login Successful!');
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Invalid username or password');
      }
    });
  }
  
    togglePassword() {
    this.showPassword = !this.showPassword;
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

  register(){
    this.router.navigate(['/registration']);
  }

}
