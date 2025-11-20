import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle } from '@ionic/angular/standalone';
import { YoutubeService } from 'src/app/core/services/youtube/youtube.service';
import { APPROVED_CHANNELS } from 'src/app/core/data/approved-channels';
import { Subject, takeUntil } from 'rxjs';
import type { YoutubeVideo } from 'src/app/core/types/youtube.types';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, CommonModule, FormsModule, RouterLink]
})
export class FeedPage implements OnInit, OnDestroy {

  private youtubeService = inject(YoutubeService);
  private destroy$ = new Subject<void>();

  loading = true;
  videos: YoutubeVideo[] = [];


  ngOnInit() {
    const feedVideos = this.youtubeService.getFeedVideos(APPROVED_CHANNELS);

    if(feedVideos){
      feedVideos.pipe(takeUntil(this.destroy$)).subscribe(data => {
        this.videos = data;
        this.loading = false;
  
        console.log(this.videos);
      });
    }
    
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
