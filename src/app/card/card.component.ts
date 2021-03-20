import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Channel } from '../twitch';
import { TwitchService } from '../twitch.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass']
})
export class CardComponent implements OnInit {

  @Input() channel?: Channel;
  @Output() next = new EventEmitter();

  constructor(private twitchService: TwitchService) { }


  doNext(): void {
    this.next.emit();
  }

  unfollow(): void {
    this.twitchService.unfollow(this.channel as Channel).subscribe();
    this.doNext();
  }

  ngOnInit(): void {
  }

}
