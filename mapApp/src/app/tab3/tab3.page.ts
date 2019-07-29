import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController, ActionSheetController, LoadingController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {

  name: string;
  numberOfSlides: number;
  loaded = false;

  user: User = {email: '',
                first_name: '',
                last_name: '',
                password: '',
                place: 'Nizhny Novgorod', 
                preferences: ['Italian', 'Russian', 'Chinese', 'Indian', 'American', 'Polish', 'Roumanian', 'Belarussian', 'Spanish','Japanese', 'Egypt', 'Canadian']
  };

  constructor(private  authService: AuthService, private  router: Router, private storage: Storage, private navCtrl: NavController,
              private actionSheetController: ActionSheetController, private loadingController: LoadingController) {

  }

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    const loading = await this.loadingController.create({
      message: 'Loading your profile'
    });
    await loading.present();

    this.loadProfile().then(() => {
      this.loadingController.dismiss();
      this.loaded = true;
    });
  }

  async loadProfile() {
    await this.storage.get('FIRST_NAME').then((val: string) => {
      this.user.first_name = val;
    });

    await this.storage.get('LAST_NAME').then((val: string) => {
      this.user.last_name = val;
    });

    await this.storage.get('user_id').then((val: string) => {
      this.user.email = val;
      this.numberOfSlides = (Math.ceil(this.user.preferences.length / 5));
      // console.log(this.numberOfSlides);
    });
  }

  async onChangeExit() {
    await this.authService.logout();
    this.navCtrl.navigateBack('login');
  }


  async presentSettingOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Sorting Options',
      buttons: [{
        text: 'Edit Profile',
        handler: () => {
          alert('Let\'s change the profile!');
        }
      }, {
        text: 'Log out',
        role: 'destructive',
        handler: () => {
          this.onChangeExit();
        }
      }]
    });
    await actionSheet.present();
  }

  arrayOf(n: number): any[] {
    let arr = Array.apply(null, {length: n}).map(Number.call, Number);
    return(arr);
  }

  getSubarray(n: number): any[] {
    // console.log(n);
    let currentIndex = n*5;
    let toReturn = this.user.preferences.slice(currentIndex, currentIndex + 5);
    // console.log(currentIndex);
    // console.log(toReturn);
    return toReturn;
  }
}
