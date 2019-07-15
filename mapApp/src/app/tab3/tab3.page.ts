import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  name: string;

  constructor(private  authService: AuthService,private  router: Router, private storage: Storage, private navCtrl: NavController) {
  }

  ionViewWillEnter() {
    this.storage.get('FIRST_NAME').then((val: string) => {
      this.name = val;
    });
  }

  ionViewDidLeave() {
    this.name = '';
  }

  async onChangeExit() {
    await this.authService.logout();
    this.navCtrl.navigateBack('login');
  }
}
