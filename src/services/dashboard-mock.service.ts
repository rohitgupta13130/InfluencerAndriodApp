// src/app/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, from, throwError } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Influencer {
  _id: string;
  fullName: string;
  email?: string;
  username?: string;
  bio?: string;
  profilePicUrl?: string;
  category?: string;
  followersCount?: number;
  platform?: string;
}

export interface MockDashboardData {
  profile: Influencer;
  stats: {
    followers: number;
    engagementRate: number;
    totalCampaigns: number;
    newFollowersLast7Days: number[];
  };
  recentActivities: Array<{ action: string; date: string }>;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = 'http://localhost:1000/dashboard/me';
  // base used to prefix relative image paths from backend
  private readonly backendBase = 'http://localhost:1000';

  // internal subject can emit null when cleared
  private subject = new BehaviorSubject<MockDashboardData | null>(null);

  /**
   * Public observable: filtered so subscribers only ever see MockDashboardData (no nulls).
   * This matches your page's `Observable<MockDashboardData>` type.
   */
  public dashboard$: Observable<MockDashboardData> = this.subject
    .asObservable()
    .pipe(filter((d): d is MockDashboardData => d !== null));

  constructor(private http: HttpClient, private auth: AuthService) {}

  // public reload called by page
  reload(): void {
    this.fetchFromApi().subscribe({
      next: (d) => this.subject.next(d),
      error: (err) => {
        console.error('Failed to load dashboard', err);
        // optional: clear subject on error
        // this.subject.next(null);
      },
    });
  }

  clear(): void {
    this.subject.next(null);
  }

  // returns observable that fetches and maps the API result to MockDashboardData
  private fetchFromApi(): Observable<MockDashboardData> {
    // getAccessToken returns a Promise<string|null>, convert to observable
    return from(this.auth.getAccessToken()).pipe(
      switchMap((token) => {
        if (!token) {
          return throwError(() => new Error('No access token available'));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        });

        return this.http.get<any>(this.apiUrl, { headers }).pipe(
          map((resp) => this.normalizeResponse(resp)),
          catchError((err) => {
            // optionally handle HTTP 401 -> clear tokens + navigate to login in caller
            return throwError(() => err);
          }),
        );
      }),
    );
  }

  // Helper: convert backend relative paths ("/uploads/...") to an absolute URL,
  // accept absolute URLs as-is, fallback to a bundled asset when missing.
  private ensureFullImageUrl(pathOrUrl: any): string {
    const raw = String(pathOrUrl ?? '').trim();
    const fallback = 'assets/default-avatar.png'; // ensure this asset exists

    if (!raw) return fallback;

    // already absolute
    if (/^https?:\/\//i.test(raw)) return raw;

    // protocol-relative (//example.com/...)
    if (raw.startsWith('//')) return `https:${raw}`;

    // starts with / => prefix backend origin
    if (raw.startsWith('/')) return `${this.backendBase}${raw}`;

    // otherwise treat as relative path on backend
    return `${this.backendBase}/${raw}`;
  }

  // normalize backend shape to the frontend's expected MockDashboardData interface
  private normalizeResponse(resp: any): MockDashboardData {
    // guard for null
    if (!resp) {
      return this.mockFallback();
    }

    // backend returns { profile, stats, recentActivities } per the server-side DashboardService
    const profileRaw = resp.profile ?? {};
    const statsRaw = resp.stats ?? {};

    // build safe image URL (prefix backend if needed)
    const rawPic = profileRaw.profilePicUrl ?? profileRaw.picture ?? profileRaw.avatar ?? '';
    const profilePicUrl = this.ensureFullImageUrl(rawPic);

    const profile: Influencer = {
      _id: profileRaw.id ?? profileRaw._id ?? 'unknown',
      fullName: profileRaw.fullName ?? profileRaw.displayName ?? '',
      email: profileRaw.email ?? '',
      username: profileRaw.username ?? '',
      bio: profileRaw.bio ?? profileRaw.description ?? '',
      profilePicUrl,
      category: profileRaw.category ?? '',
      followersCount: statsRaw.followers ?? profileRaw.followersCount ?? 0,
      platform: profileRaw.platform ?? '',
    };

    const stats = {
      followers: Number(statsRaw.followers ?? profile.followersCount ?? 0),
      engagementRate: Number(statsRaw.engagementRate ?? 0),
      totalCampaigns: Number(statsRaw.totalCampaigns ?? 0),
      newFollowersLast7Days: Array.isArray(statsRaw.newFollowersLast7Days)
        ? statsRaw.newFollowersLast7Days.map((n: any) => Number(n) || 0)
        : [0, 0, 0, 0, 0, 0, 0],
    };

    const recentActivities =
      Array.isArray(resp.recentActivities) && resp.recentActivities.length
        ? resp.recentActivities.map((a: any) => ({
            action: a.action ?? a.title ?? 'Activity',
            date: new Date(a.date ?? Date.now()).toISOString(),
          }))
        : [
            { action: 'Registered account', date: new Date().toISOString() },
            { action: 'Profile updated', date: new Date().toISOString() },
          ];

    return {
      profile,
      stats,
      recentActivities,
    };
  }

  // fallback local mock if API returns nothing
  private mockFallback(): MockDashboardData {
    return {
      profile: {
        _id: 'mock-1',
        fullName: 'Demo Influencer',
        email: 'demo@influencer.app',
        username: 'demo_influencer',
        bio: 'Creator of lifestyle content',
        profilePicUrl: 'assets/default-avatar.png',
        category: 'Lifestyle',
        followersCount: 1240,
        platform: 'Instagram',
      },
      stats: {
        followers: 1240,
        engagementRate: 4.7,
        totalCampaigns: 6,
        newFollowersLast7Days: [5, 8, 12, 3, 7, 0, 10],
      },
      recentActivities: [
        { action: 'Posted a reel', date: new Date().toISOString() },
        { action: 'Gained 120 followers', date: new Date(Date.now() - 86400000).toISOString() },
      ],
    };
  }
}
