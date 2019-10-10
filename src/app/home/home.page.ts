import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SettingsPage } from '../settings/settings.page';
import { DataService } from '../services/data.service';
import { RedditService } from '../services/reddit.service';
import { Key } from 'protractor';

const { Browser, Keyboard } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  public subredditForm: FormGroup;

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService,
    private redditService: RedditService
  ) {
    this.subredditForm = new FormGroup({
      subredditControl: new FormControl(''),
    });
  }

  ngOnInit() {
    this.redditService.load();

    this.subredditForm
      .get('subredditControl')
      .valueChanges.pipe(
        debounceTime(1500),
        distinctUntilChanged()
      )
      .subscribe((subreddit: any) => {
        if (subreddit.length > 0) {
          this.redditService.changeSubReddit(subreddit);
          Keyboard.hide().catch(err => {
            console.warn(err);
          });
        }
      });
  }

  showComments(post): void {
    Browser.open({
      toolbarColor: '#fff',
      url: `https://reddit.com${post.data.permalink}`,
      windowName: '_system'
    });
  }

  openSettings(): void {}

  playVideo(e, post): void {
    // Create a reference to the video
    const video = e.target;

    // Toggle the video playing
    if (video.paused) {
      // Show the loader gif
      video.play();

      video.addEventListener('playing', () => {
        console.log('playing video');
      });
    } else {
      video.pause();
    }
  }

  loadMore(): void {
    this.redditService.nextPage();
  }
}
