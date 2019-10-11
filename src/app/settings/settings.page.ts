import { Component } from '@angular/core';
import { RedditService } from '../services/reddit.service';
import { DataService } from '../services/data.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  constructor(
    public redditService: RedditService,
    private dataService: DataService,
    private modalCtrl: ModalController,
  ) { }

  save(): void {
    const {perPage, sort, subReddit} = this.redditService.settings;
    this.dataService.save({perPage, sort, subReddit});

    this.close();
  }

  close(): void {
    this.modalCtrl.dismiss();
  }
}
