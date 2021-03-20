import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TwitchService } from '../twitch.service';
import { Channel } from '../twitch';

@Component({
  selector: 'app-tinder',
  templateUrl: './tinder.component.html',
  styleUrls: ['./tinder.component.sass']
})
export class TinderComponent implements OnInit {

  channels: Channel[] = [];
  currentIndex = 0;

  constructor(public twitchService: TwitchService, private location: Location) { }

  login(): void {
    window.location.href = this.twitchService.loginUrl('https://' + window.location.host);
  }

  ngOnInit(): void {
    const maybeToken = document.location.hash;
    if (maybeToken !== '') {
      const token = maybeToken.split('&')[0].split('=')[1];
      this.location.replaceState('');
      this.twitchService.token = token;
      this.getFollows();
    }
  }

  nextChannel(): void {
    this.currentIndex++;
  }

  getFollows(): void {
    this.twitchService.getFollows().subscribe(channels => this.channels = channels);
  }

}
