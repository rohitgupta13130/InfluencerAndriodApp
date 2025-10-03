import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { InfluencerService } from 'src/services/influencer.service';
import { Influencer } from 'src/models/influencer.model';

@Component({
  selector: 'app-influencers',
  templateUrl: './influencer.page.html',
  styleUrls: ['./influencer.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
})
export class InfluencersPage {
  influencers$!: Observable<Influencer[]>;
  baseUrl!: string;

  constructor(private influencerService: InfluencerService) {
    // initialize after DI
    this.baseUrl = this.influencerService.getBaseUrl();
    this.influencers$ = this.influencerService.getAll();
  }
}
