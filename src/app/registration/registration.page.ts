import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonList, IonItem, IonLabel, IonInput, IonTextarea, IonButton, IonImg } from '@ionic/angular/standalone';
import{ InfluencerRegistrationDto} from '../dto/influencer-registration.dto';
import{HttpClient} from '@angular/common/http';
import { IonicModule } from '@ionic/angular';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
  standalone: true,
  imports: [ CommonModule, FormsModule,IonicModule]
})
export class RegistrationPage implements OnInit {

  influencer : InfluencerRegistrationDto= new InfluencerRegistrationDto();

  constructor(private http:HttpClient) { }

  ngOnInit() {
  }

  registerInfluencer(){

    console.log('Registration DTO:', this.influencer);

      this.http.post('http://localhost:3000/influencers/register', this.influencer, {
      headers: { 'Content-Type': 'application/json' }
    }).subscribe({
      next: (response) => {
        console.log('Registration success:', response);
        alert('Registration Successful!');
      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert('Something went wrong, please try again.');
      }
    });

  }

}
