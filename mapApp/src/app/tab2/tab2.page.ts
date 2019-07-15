import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private  router: Router, private navCtrl: NavController) {}

  text = '';

  onChangeAlert() {
    if (this.text === '') {
      this.text = 'random';
    }
    // alert('Sending request with key: ' + this.text);
    this.text = '';
    this.navCtrl.navigateForward('searches');
  }
}
