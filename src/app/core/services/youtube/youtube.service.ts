import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, forkJoin, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {

  //API String for channel searching
  // https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&q=dog%20training&type=channel&part=snippet,id&maxResults=25

  private API_KEY = 'fail'

  constructor(private http: HttpClient) {}

  getChannelVideos(channelId: string): Observable<any[]> {
    const apiString = `https://www.googleapis.com/youtube/v3/search?key=${this.API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`

    const results = this.http.get<any>(apiString).pipe(
      map(res => res.items || [])
    );

    return results
  }

  getFeedVideos(channelIds: string[]): Observable<any[]>{
    const calls = channelIds.map(id => this.getChannelVideos(id));

    const results = forkJoin(calls).pipe(
      map(resultArrays => resultArrays.flat())
    );
    return results
  }
}
