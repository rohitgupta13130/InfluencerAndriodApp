// src/app/pages/dashboard/dashboard.page.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { DashboardService, MockDashboardData } from 'src/services/dashboard-mock.service';
import { AuthService } from 'src/services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, IonicModule, AsyncPipe],
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  data$!: Observable<MockDashboardData>;
  Math = Math; // expose Math for template calculations

  constructor(
    private svc: DashboardService,
    private auth: AuthService,
    private router: Router
  ) {
    this.data$ = this.svc.dashboard$;
    this.svc.reload(); // load initial mock data
  }

  refresh(event: any) {
    this.svc.reload();
    setTimeout(() => event?.target?.complete(), 600);
  }

  async logout() {
    await this.auth.clearTokens();
    this.svc.clear();
    // navigate to login (replaceUrl prevents back nav)
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
