import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, forkJoin, Observable, shareReplay, of } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import type {
  YoutubeResponse,
  YoutubeVideo,
  ChannelVideos,
} from '../../types/youtube.types';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  //API String for channel searching
  // https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&q=dog%20training&type=channel&part=snippet,id&maxResults=25

  private API_KEY = environment.youtubeApiKey;
  private CACHE_KEY = 'youtube_video_cache';

  constructor(private http: HttpClient) {}

  getChannelVideos(channelId: string): Observable<YoutubeVideo[]> {
    // Check cache first
    const cached = this.checkCache(channelId);
    if (cached) {
      console.log(`Cache HIT for channel ${channelId}`);
      return of(cached);
    }

    console.log(`Cache MISS - API Call for channel ${channelId}`);

    const apiString = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10&type=video&videoDuration=medium`;

    return this.http.get<YoutubeResponse>(apiString).pipe(
      map((res) => {
        const videos = res.items || [];
        // Store in cache
        this.saveToCache(channelId, videos);
        return videos;
      }),
      shareReplay(1),
    );
  }

  getFeedVideos(channelIds: string[]): Observable<ChannelVideos[]> {
    const calls = channelIds.map((channelId) =>
      this.getChannelVideos(channelId).pipe(
        map((videos) => ({
          channelId,
          videos,
        })),
      ),
    );

    return forkJoin(calls);
  }

  checkCache(channelId: string): YoutubeVideo[] | null {
    try {
      const cacheData = localStorage.getItem(this.CACHE_KEY);
      if (!cacheData) return null;

      const cache = JSON.parse(cacheData);
      const cached = cache[channelId];

      if (cached) {
        const now = Date.now();
        const twelveHours = 12 * 60 * 60 * 1000;
        if (now - cached.date < twelveHours) {
          return cached.data;
        }
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  }

  saveToCache(channelId: string, videos: YoutubeVideo[]): void {
    try {
      const cacheData = localStorage.getItem(this.CACHE_KEY);
      const cache = cacheData ? JSON.parse(cacheData) : {};

      cache[channelId] = {
        date: Date.now(),
        data: videos,
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }

  clearCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    console.log('Cache cleared');
  }
}
