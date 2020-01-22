import { Component, HostListener, Input, OnChanges } from '@angular/core';
import { WindowService } from '../services-singleton/window.service';
import { CommentThreadsService } from '../services-singleton/comment-threads.service';
import { CommentThread } from '../models/comment/comment-thread';
import { FormatterService } from '../services-singleton/formatter.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommentThreadOrder } from '../shared/enums/comment-thread-order';

@Component({
  selector: 'app-video-comments',
  templateUrl: './video-comments.component.html',
  styleUrls: ['./video-comments.component.scss']
})
export class VideoCommentsComponent implements OnChanges {

  @Input() parentId: string;
  @Input() order: CommentThreadOrder;
  nextPageToken: string;
  commentThreads: CommentThread[];
  isFirstPage: boolean = true;

  constructor(
    public formatterService: FormatterService,
    private windowService: WindowService,
    private commentThreadsService: CommentThreadsService,
    public domSanitizer: DomSanitizer
  ) {
    this.commentThreads = [];
  }

  ngOnChanges() {
    this.resetComments();
  }

  resetComments(): void {
    this.nextPageToken = undefined;
    this.isFirstPage = true;
    this.commentThreads = [];
  }

  @HostListener("window:scroll")
  private onReachBottom(): void {
    this.windowService.onReachBottom(() => {
      if (this.nextPageToken || this.isFirstPage) {
        this.isFirstPage = false;
        this.loadComments();
      }
    });
  }

  loadComments(): void {
    this.commentThreadsService.getByVideoId(this.parentId, this.order, this.nextPageToken)
      .subscribe(data => {
        this.nextPageToken = data.nextPageToken;
        this.commentThreads.push(...data.items);
      });
  }
}
