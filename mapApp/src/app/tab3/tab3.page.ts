import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  name: string;

  constructor(private  router: Router, private storage: Storage) {
    this.storage.get('first_name').then((val: string) => {
      this.name = val;
    });
  }

  async onChangeExit() {
    this.storage.set('id', null);
    this.storage.set('first_name', null);
    this.storage.set('last_name', null);
    this.router.navigateByUrl('login');
  }
}
