import { Component, OnInit,inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonItem,
   IonIcon} from '@ionic/angular/standalone';
  import { Router } from '@angular/router';
import { personCircleOutline, lockClosedOutline, logInOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
 import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent,IonButton,IonInput,IonItem, IonIcon,CommonModule, FormsModule]
})
export class LoginPage implements OnInit {

  username: string = '';
  password: string = '';
  showPassword: boolean = false;
  errorMessage: string = '';
  logoUrl: string = '';

  constructor(private http: HttpClient,private router: Router) 
  {
    addIcons({personCircleOutline, lockClosedOutline,logInOutline});
   }

  ngOnInit() {
  // ✅ Backend se logo fetch
  this.http.get<{ logoUrl: string }>('http://localhost:1000/logo')
    .subscribe({
      next: (res) => {
        this.logoUrl = res.logoUrl; // 👈 backend JSON key
      },
      error: (err) => {
        console.error('Logo fetch failed', err);
        this.logoUrl = 'assets/logo.jpeg'; // fallback
      }
    });
}


    login() {
       const body = {username: this.username,password: this.password};
       console.log(this.username + '' + this.password );
       this.http.post<any>('http://localhost:1000/auth/login', body, {
      headers: { 'Content-Type': 'application/json' }
    })
    .subscribe({
      next: (response) => {
        const token = response.token;
        localStorage.setItem('authToken', token);
        console.log('Bearer Token:', token);
        alert('Login Successful!');
        this.router.navigateByUrl('/home', { replaceUrl: true });
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
    //alert('Instagram Login Clicked');
    window.location.href = 'http://localhost:1000/instagram/login';
  }

  loginClick() {
    console.log('Login clicked:', this.username, this.password);
    alert(`Welcome ${this.username || 'User'}!`);
  }

  register(){
    this.router.navigate(['/registration']);
  }

}
