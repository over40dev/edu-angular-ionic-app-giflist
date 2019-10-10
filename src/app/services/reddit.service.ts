import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from './data.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RedditService {
  public settings = {
    perPage: 10,
    subReddit: 'gifs',
    sort: 'hot',
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
    // this.dataService.getData();
    this.fetchData();
  }

  fetchData(): void {
    const { subReddit: sub, sort, perPage } = this.settings;
    // Build the URL that will be used to access the API based on the users current preferences
    let url = `https://www.reddit.com/r/${sub}/${sort}/.json?limit=100`;

    // Only grab posts from the API after the last post we retrieved (if we've already fetched some data)
    if (this.after) {
      url += `&after=${this.after}`;
    }

    this.loading = true;

    this.http
      .get(url)
      .pipe(
        // Modify the response to return data in a more friendly format
        map((res: any) => {
          // console.log(res);
          let response = res.data.children;
          let validPosts = 0;

          // Remove any posts that don't provide a GIF in a suitable format
          response = response.filter(post => {
            post.data.snapshot = '';
            // If we've already retrieved enough posts for a page, we don't want anymore
            if (validPosts >= perPage) {
              return false;
            }

            // We only want to keep .gifv and .webm formats, and then convert them to mp4
            if (
              post.data.url.indexOf('.gifv') > -1 ||
              post.data.url.indexOf('.webm') > -1
            ) {
              post.data.url = post.data.url.replace('.gifv', '.mp4');
              post.data.url = post.data.url.replace('.webm', '.mp4');

              // If a preview image is available, assign it to the post as 'snapshot'
              if (typeof post.data.preview !== 'undefined') {
                post.data.snapshot =
                  post.data.preview.images[0].source.url.replace(
                    /&amp;/g,
                    '&'
                  ) || '';

                // If the snapshot is undefined, change it to be blank so it doesnt use a broken image
                //   if (post.data.snapshot === 'undefined') {
                //     post.data.snapshot = '';
                //   }
                // } else {
                //   post.data.snapshot = '';
              }

              validPosts++;

              return true;
            } else {
              return false;
            }
          });

          // If we had enough valid posts, set that as the "after", otherwise just set the last post
          if (validPosts >= perPage) {
            this.after = response[perPage - 1].data.name;
          } else if (response.length > 0) {
            this.after =
            response[response.length - 1].data.name;
            // console.log(this.after);
          }
          return response;
        })
      )
      .subscribe(
        (data: any) => {
          // Add new posts we just pulled in to the existing posts
          this.posts.push(...data);

          // Keep fetching more GIFs if we didn't retrieve enough to fill a page
          // But give up after 50 tries if we still don't have enough
          if (this.moreCount > 50) {
            console.log('giving up');

            // Time to give up!
            this.moreCount = 0;
            this.loading = false;
          } else {
            // If we don't have enough valid posts to fill a page, try fetching more data
            if (this.posts.length < perPage * this.page) {
              this.fetchData();
              this.moreCount++;
            } else {
              this.loading = false;
              this.moreCount = 0;
            }
          }
        },
        err => {
          console.log(err);
          // Fail silently, in this case the loading spinner will just continue to display
          console.log('Can\'t find data!');
        }
      );
  }

  nextPage(): void {}

  resetPosts(): void {}

  changeSubReddit(subreddit): void {}
}
