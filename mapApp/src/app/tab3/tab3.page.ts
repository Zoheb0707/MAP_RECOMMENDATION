import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {

  name: string;

  user: User = {user_id: '',
                first_name: '',
                last_name: '',
                password: '',
  };

  mySlideOptions = {
    pager:true
  };

  constructor(private  authService: AuthService, private  router: Router, private storage: Storage, private navCtrl: NavController) {
  }

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    await this.storage.get('FIRST_NAME').then((val: string) => {
      this.user.first_name = val;
    });

    await this.storage.get('LAST_NAME').then((val: string) => {
      this.user.last_name = val;
    });

    await this.storage.get('user_id').then((val: string) => {
      this.user.user_id = val;
    });
  }

  editProfile() {
    alert('Let\'s change the profile!');
  }

  async onChangeExit() {
    await this.authService.logout();
    this.navCtrl.navigateBack('login');
  }
}
