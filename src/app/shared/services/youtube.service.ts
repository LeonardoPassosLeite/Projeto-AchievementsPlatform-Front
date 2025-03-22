import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiUrl = 'https://www.googleapis.com/youtube/v3/search';

  constructor(private http: HttpClient) {}

  searchVideo(query: string) {
    const params = {
      part: 'snippet',
      q: query,
      type: 'video',
      key: environment.youtubeApiKey, 
      maxResults: '5', 
    };
    return this.http.get(this.apiUrl, { params });
  }
}