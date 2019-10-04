import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormControl, FormGroup } from '@angular/forms';
import { Plugins } from '@capacitor/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SettingsPage } from '../settings/settings.page';
import { DataService } from '../services/data.service';
import { RedditService } from '../services/reddit.service';

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

  ngOnInit() {}

  showComments(post): void {}

  openSettings(): void {}

  playVideo(e, post): void {}

  loadMore(): void {}
}
