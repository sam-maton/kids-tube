import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { YoutubeService } from 'src/app/core/services/youtube/youtube.service';
import { APPROVED_CHANNELS } from 'src/app/core/data/approved-channels';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FeedPage implements OnInit {

  private youtubeService = inject(YoutubeService);
  loading = true;
  videos: any[] = [];


  ngOnInit() {
    this.youtubeService.getFeedVideos(APPROVED_CHANNELS).subscribe(data => {
      this.videos = data;
      this.loading = false;
    });
  }

}
