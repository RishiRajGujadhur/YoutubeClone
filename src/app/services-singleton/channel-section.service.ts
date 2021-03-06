import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ChannelSection } from '../models/channel-section/channel-section';
import { Url } from '../shared/url';
import { Constants } from '../shared/constants';
import { pluck } from 'rxjs/operators';

const PATH = 'channelSections';

@Injectable({
  providedIn: 'root'
})
export class ChannelSectionService {

  constructor(
    private http: HttpClient
  ) { }

  getByChannelId(channelId: string): Observable<ChannelSection[]> {
    const queryParams = {
      part: 'snippet,contentDetails',
      channelId: channelId
    };
    const url = new Url(Constants.BASE_URL, [PATH], queryParams)
    const data$ = this.http.get(url.toString()).pipe(
      pluck<any, ChannelSection[]>('items')
    );

    return data$;
  }
}
