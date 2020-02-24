import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

import { AuthService } from '../auth/auth.service';

import {AutoCompleteOptions} from 'ionic4-auto-complete';

import {SimpleFunction} from '../services/simple-function.service';

import * as firebase from 'firebase/app';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {

  public options: AutoCompleteOptions;

  public selected: any = '';

  public objects = ['RAM Restaurant & Brewery - University Village', 'CaliBurger',
                    'Taste of Xi\'an', 'Costa\'s'];

  constructor(private  router: Router, private navCtrl: NavController, private auth: AuthService, public simpleFunction: SimpleFunction) {
  }

  // onChangeAlert() {
  //   if (this.text === '') {
  //     this.text = 'random';
  //   }
  //   this.text = '';
  //   this.navCtrl.navigateForward('searches');
  // }

  // getItems(ev: any) {
  //   // Reset items back to all of the items
  //   this.initializeItems();

  //   // set val to the value of the searchbar
  //   const val = ev.target.value;

  //   if (val.trim() === '') {
  //     this.items = [];
  //     this.isItemAvailable = false;
  //   } else

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() !== '') {
  //     this.isItemAvailable = true;
  //     this.items = this.items.filter((item) => {
  //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     });
  //   }
  // }

  // select(option: string) {
  //   this.text = option;
  //   this.items = [];
  //   this.isItemAvailable = false;
  // }

}
