import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  text = '';
  
  constructor(private  router: Router, private navCtrl: NavController, private auth: AuthService) {}

  onChangeAlert() {
    if (this.text === '') {
      this.text = 'random';
    }
    // alert('Sending request with key: ' + this.text);
    this.text = '';
    this.navCtrl.navigateForward('searches');
  }
}
