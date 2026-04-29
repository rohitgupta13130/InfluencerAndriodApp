import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'influencer-dashboard', 
    loadComponent: () => import('./pages/dashboard/influencer-dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]  
  },
  {
    path: 'user-dashboard',
    loadComponent: () => import('./pages/dashboard/user-dashboard/user-dashboard.page').then(m => m.UserDashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'chat/:id',
    loadComponent: () => import('./pages/chat/chat.page').then(m => m.ChatPage),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login'
  },


];