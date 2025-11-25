import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonText,
  IonSpinner,
} from '@ionic/angular/standalone';
import { YoutubeService } from 'src/app/core/services/youtube/youtube.service';
import { APPROVED_CHANNELS } from 'src/app/core/data/approved-channels';
import { Subject, takeUntil } from 'rxjs';
import type { ChannelVideos } from 'src/app/core/types/youtube.types';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [
    IonSpinner,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonText,
    IonCardTitle,
    IonCardSubtitle,
    CommonModule,
    FormsModule,
    RouterLink,
  ],
})
export class FeedPage implements OnInit, OnDestroy {
  private youtubeService = inject(YoutubeService);
  private destroy$ = new Subject<void>();

  loading = true;
  error = false;
  channels: ChannelVideos[] = [];

  ngOnInit() {
    this.loadVideos();
  }

  loadVideos() {
    const feedVideos = this.youtubeService.getFeedVideos(APPROVED_CHANNELS);

    if (feedVideos) {
      feedVideos.pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          this.channels = data;
          this.loading = false;
          console.log(data);
        },
        error: (err) => {
          console.error('Error fetching feed videos:', err);
          this.loading = false;
          this.error = true;
        },
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
