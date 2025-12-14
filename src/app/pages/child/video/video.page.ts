import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';
import { chevronBackOutline } from 'ionicons/icons';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'app-video',
  templateUrl: './video.page.html',
  styleUrls: ['./video.page.scss'],
  standalone: true,
  imports: [
    IonIcon,
    IonContent,
    IonHeader,
    IonToolbar,
    IonButton,
    IonButtons,
    CommonModule,
    FormsModule,
    YouTubePlayer,
    RouterLink,
  ],
})
export class VideoPage {
  videoId = signal('');
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    addIcons({ chevronBackOutline });
    this.activatedRoute.params.subscribe((params) =>
      this.videoId.set(params['id']),
    );
  }
}
