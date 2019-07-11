import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page {

  name: string;

  constructor(private  authService: AuthService,private  router: Router, private storage: Storage) {
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
    this.router.navigateByUrl('login');
  }
}
