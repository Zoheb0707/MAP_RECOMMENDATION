import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
@Injectable()
export class LoginPage {

  constructor(private router: Router, private http: HttpClient, private alertCtrl: AlertController, private storage: Storage) {
    this.storage.get('id').then((val) => {
      if (val != null) {
        this.router.navigateByUrl('/app/tabs/search');
      }
    });
  }

  navTabs(form) {
    let mode = '';
    if (form.value.email != null && form.value.password != null) {
      mode = 'one&user=' + form.value.email;
    } else {
      mode = 'all';
    }

    this.getData(mode)
      .then(data => {
        if (data["password"] === form.value.password) {
          this.storage.set('id', data["user_id"]);
          this.storage.set('first_name', data["first_name"]);
          this.storage.set('last_name', data["last_name"]);
          this.router.navigateByUrl('/app/tabs/search');
        } else {
          alert("Wrong Password!");
        }
      });
  }

  getData(mode: string) {
    const url = 'http://localhost:80/get_users.php?mode=' + mode;

    return new Promise(resolve => {
      this.http.get(url)
        .subscribe((data: any) => {
          resolve(data);
        }, error => {
          // resolve(error);
        });
    });
  }
}
