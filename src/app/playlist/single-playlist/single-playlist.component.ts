import {
  Component, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, Output, EventEmitter, ElementRef, ViewChild,
} from '@angular/core';

import { ChannelSectionStyle } from 'src/app/shared/enums/channel-section-style';
import { PlaylistService } from 'src/app/services-singleton/playlist.service';
import { VideoService } from 'src/app/services-singleton/video.service';
import { concatMap } from 'rxjs/operators';
import { Video } from 'src/app/models/video/video';
import { VideoThumbnailSize } from 'src/app/shared/enums/video-thumbnail-size';
import { ChannelSection } from 'src/app/models/channel-section/channel-section';
import { WindowService } from 'src/app/services-singleton/window.service';

const MAX_PLAYLIST_ITEM_RESULTS = 5;

@Component({
  selector: 'app-single-playlist',
  templateUrl: './single-playlist.component.html',
  styleUrls: ['./single-playlist.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SinglePlaylistComponent implements OnInit {

  @ViewChild('rightBtn', { static: false }) rightBtn: ElementRef;
  @Output('totalResultsCount') totalResultsCount = new EventEmitter<number>();
  @Input() channelSection: ChannelSection;
  @Input() style: ChannelSectionStyle;
  videos: Video[] = [];
  videoSize: VideoThumbnailSize = VideoThumbnailSize.medium;
  videoTitleMaxLength: number = 35;
  private nextPageToken: string;
  private isFirstPage: boolean = true;
  callBack: Function = (callback: Function) => this.loadMoreVideos(callback);

  constructor(
    private playlistService: PlaylistService,
    private videoService: VideoService,
    private changeDetectorRef: ChangeDetectorRef,
    public windowService: WindowService
  ) { }

  ngOnInit(): void {
    this.loadMoreVideos(() => { });
  }

  loadMoreVideos(callback: Function): void {
    if (this.isFirstPage === false && this.nextPageToken === undefined) {
      return;
    }

    this.isFirstPage = false;

    const playlistId = this.channelSection.contentDetails.playlists[0];
    this.playlistService.getById(playlistId, MAX_PLAYLIST_ITEM_RESULTS, this.nextPageToken).pipe(
      concatMap(data => {
        const videoIds = data.items.map(item => item.contentDetails.videoId);
        this.nextPageToken = data.nextPageToken;
        this.totalResultsCount.emit(data.pageInfo.totalResults);

        return this.videoService.getByIds(...videoIds);
      })
    ).subscribe(videos => {
      this.videos.push(...videos);

      callback();

      this.changeDetectorRef.markForCheck();
    });
  }

  onPlaylistResize(): void {
    this.changeDetectorRef.markForCheck();
  }
}
