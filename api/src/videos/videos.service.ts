import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { YoutubeResponse } from '@shared/types/youtube.types';

@Injectable()
export class VideosService {
  private readonly apiKey: string | undefined;
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
  }

  async getChannelVideos(channelId: string): Promise<YoutubeResponse> {
    if (!this.apiKey) {
      throw new Error('YOUTUBE_API_KEY is not defined');
    }

    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=20&type=video&videoDuration=medium`;

    const { data } = await firstValueFrom(
      this.httpService.get<YoutubeResponse>(url).pipe(
        catchError((error: AxiosError) => {
          throw new Error(`Failed to fetch videos: ${error.message}`);
        }),
      ),
    );

    console.log('Data retrieved for channel: ' + channelId);

    return data;
  }
}
