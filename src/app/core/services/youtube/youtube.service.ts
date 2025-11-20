import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, forkJoin, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local';
import type { YoutubeResponse, YoutubeVideo } from '../../types/youtube.types';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {

  //API String for channel searching
  // https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&q=dog%20training&type=channel&part=snippet,id&maxResults=25

  private API_KEY = environment.youtubeApiKey

  constructor(private http: HttpClient) {}

  getChannelVideos(channelId: string): Observable<YoutubeVideo[]> {
    const apiString = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10&type=video&videoDuration=medium`

    const results = this.http.get<YoutubeResponse>(apiString).pipe(
      map(res => res.items || [])
    );

    return results
  }

  getFeedVideos(channelIds: string[]): Observable<YoutubeVideo[]>{
    const calls = channelIds.map(id => this.getChannelVideos(id));

    const results = forkJoin(calls).pipe(
      map(resultArrays => resultArrays.flat())
    );
    return results
  }
}
