import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RedditService {

  public settings = {
    perPage: 10,
    subReddit: 'gifs',
    sort: '/hot',
  };

  public posts: any[];
  public loading: boolean;
  private page: number;
  private after: string;
  private moreCount: number;

  constructor(private http: HttpClient, private dataService: DataService) {
    this.posts = [];
    this.loading = false;
    this.page = 1;
    this.moreCount = 0;
  }

  load(): void {

  }

  fetchData(): void {

  }

  nextPage(): void {

  }

  resetPosts(): void {

  }

  changeSubReddit(subreddit): void {

  }





}
