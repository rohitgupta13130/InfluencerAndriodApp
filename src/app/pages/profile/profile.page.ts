import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';

import { ProfileService } from '../../services/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonTitle],
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss']
})
export class ProfilePage implements OnInit {

  user: any = null;
  userId!: number;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    // ✅ Safely get ID
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      console.error('❌ No ID in route');
      return;
    }

    this.userId = Number(id);
    console.log('User ID:', this.userId);

    this.loadProfile();
  }

  loadProfile() {
    const token = localStorage.getItem('token');

    // ✅ Prevent API call if token missing
    if (!token) {
      console.error('❌ Token missing, skipping API call');
      return;
    }

    this.profileService.getUserById(this.userId).subscribe({
      next: (res: any) => {
        console.log('✅ Profile Data:', res);
        this.user = res;
      },
      error: (err) => {
        console.error('❌ Profile error:', err);

        // ❌ DO NOT redirect to login here
        // this.router.navigate(['/login']);
      }
    });
  }
}