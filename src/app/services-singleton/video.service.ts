import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Url } from '../shared/url';
import { Observable } from 'rxjs';
import { ServiceModel } from '../models/service-models/service-model';
import { Video } from '../models/video/video';
import { pluck, map } from 'rxjs/operators';
import { RatingType } from '../shared/enums/rating-type';
import { HttpConfigService } from './http-config.service';
import { Constants } from '../shared/constants';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  constructor(
    private http: HttpClient,
    private httpConfigService: HttpConfigService
  ) { }

    // TODO: Slice the descripiton here
  getMostPopular(regionCode: string, maxResults: number, pageToken: string): Observable<ServiceModel<Video>> {
    const queryParams = {
      part: 'snippet,contentDetails,status,statistics,player,liveStreamingDetails,localizations',
      fields: '*',
      mine: 'true',
      chart: 'mostPopular',
      regionCode: regionCode,
      maxResults: maxResults.toString()
    }
    this.addPageToken(queryParams, pageToken);

    const url = new Url(Constants.BASE_URL, [], queryParams);
    const data$ = this.http.get<ServiceModel<Video>>(url.toString());

    return data$;
  }

  private addPageToken(queryParams: any, pageToken: string): void {
    if (pageToken) {
      queryParams.pageToken = pageToken;
    }
  }

  getById(id: string): Observable<Video> {
    const queryParams = {
      part: 'snippet,contentDetails,statistics',
      id: id
    };

    const url = new Url(Constants.BASE_URL, [], queryParams);
    const data$ = this.http.get(url.toString())
      .pipe(
        pluck('items'),
        map(data => data[0])
      );

    return data$;
  }

  getRating(id: string): Observable<RatingType> {
    const queryParams = {
      id: id
    };
    const url = new Url(Constants.BASE_URL, ['getRating'], queryParams);
    const data$ = this.http.get(url.toString())
      .pipe(
        pluck('items'),
        map<any, RatingType>(data => {
          const ratingName: string = data[0].rating;
          const ratingType: RatingType = RatingType[ratingName];

          return ratingType;
        })
      );

    return data$;
  }

  rate(id: string, rating: RatingType): Observable<number> {
    const queryParams = {
      id: id,
      rating: RatingType[rating]
    };
    const url = new Url(Constants.BASE_URL, ['rate'], queryParams);
    const data$ = this.httpConfigService.getConfigPostResponse(url.toString(), {}).pipe(
      map(data => data.status)
    );

    return data$;
  }
}
