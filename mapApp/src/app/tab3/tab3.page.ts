import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { NavController, ActionSheetController, LoadingController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthUser } from '../providers/auth-user';
import { User } from '../providers/user';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})

export class Tab3Page implements OnInit {

  name: string;
  numberOfSlides = 1;
  loaded = false;

  user: User = {uid: '',
                name: {
                  first: '',
                  last: ''
                },
                city: '',
                preferences: [],
                visits: [],
                visitsTwo: undefined
  };

  constructor(private  authService: AuthService, private navCtrl: NavController,
              private actionSheetController: ActionSheetController, private loadingController: LoadingController,
              public fAuth: AngularFireAuth, private userAuth: AuthUser) {

  }

  ionViewWillEnter() {
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
    this.user = this.userAuth.getUser();
    console.log(this.user);
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
