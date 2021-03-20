import { Injectable } from '@angular/core';
import { Channel } from './twitch';
import { Observable, of, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const ID = 'vbxjue3t148z39syfw9ktbd2z9ezr0';
const SCOPE = 'user:edit:follows';


@Injectable({
  providedIn: 'root'
})
export class TwitchService {

  token?: string;

  get(url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        'Client-Id': ID
      })
    };
    return this.http.get(url, httpOptions);
  }

  delete(url: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
        'Client-Id': ID
      })
    };
    return this.http.delete(url, httpOptions);
  }

  getUserId(): Observable<string> {
    const subject = new Subject<string>();
    this.get('https://api.twitch.tv/helix/users').subscribe(data => {
      subject.next(data.data[0].id);
    });
    return subject.asObservable();
  }

  getFollows(): Observable<Channel[]> {
    const subject = new Subject<Channel[]>();
    this.getUserId().subscribe(userId => {
      const url = `https://api.twitch.tv/helix/users/follows?from_id=${userId}&first=100`;
      this.get(url)
      .subscribe(data => {
        if (data.total > 100) {
          console.warn('more than 100 followers not supported.');
        }
        const ids: string[] = data.data.map((d: any) => d.to_id);
        this.getFullChannelInfo(ids).subscribe(channels => subject.next(channels));
      });
    });
    return subject.asObservable();
  }

  constructor(private http: HttpClient) { }

  unfollow(channel: Channel): Observable<void> {
    const subject = new Subject<void>();
    this.getUserId().subscribe(id => {
      const url = `https://api.twitch.tv/helix/users/follows?from_id=${id}&to_id=${channel.id}`;
      this.delete(url).subscribe(() => subject.next(void 0));
    });
    return subject.asObservable();
  }

  getFullChannelInfo(ids: string[]): Observable<Channel[]> {
    const subject = new Subject<Channel[]>();
    this.get('https://api.twitch.tv/helix/users?' + ids.map(id => `id=${id}`).join('&'))
      .subscribe(data => {
                 const channels = data.data.map((da: any) => ({
                   name: da.display_name,
                   id: da.id,
                   profile: da.profile_image_url,
                   description: da.description
                 } as Channel));
                 subject.next(channels);
      });
    return subject.asObservable();
  }

  loginUrl(redirect: string): string {

    return `https://id.twitch.tv/oauth2/authorize?client_id=${ID}&redirect_uri=${redirect}&response_type=token&scope=${SCOPE}`;
  }
}
