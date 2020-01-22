import { Component, OnInit, HostListener } from '@angular/core';
import { Channel } from '../models/channel/channel';
import { ChannelService } from '../services-singleton/channel.service';
import { WindowService } from '../services-singleton/window.service';
import { Constants } from '../shared/constants';
import { FormatterService } from '../services-singleton/formatter.service';

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  baseChannelUrl: string = Constants.BASE_CHANNEL_URL;
  channels: Channel[];
  isFirstPage: boolean = true;
  nextPageToken: string;

  constructor(
    private formatterService: FormatterService,
    private channelService: ChannelService,
    private windowService: WindowService
  ) {
    this.channels = [];
  }

  @HostListener("window:scroll")
  private onReachBottom(): void {
    this.windowService.onReachBottom(() => {
      if (this.nextPageToken || this.isFirstPage) {
        this.loadSubscriptions();
        this.isFirstPage = false;
      }
    });
  }

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    const maxDescriptionLength = 100;

    const maxResults = 50;
    this.channelService.getSubscriptions(maxResults, this.nextPageToken)
      .subscribe(data => {
        this.nextPageToken = data.nextPageToken;
        data.items.forEach(currentChannel => {
          const description = currentChannel.snippet.description;
          const conciseDescription = this.formatterService.getConcisedString(description, maxDescriptionLength);
          currentChannel.snippet.description = conciseDescription;
        });
        this.channels.push(...data.items);
      });
  }
}