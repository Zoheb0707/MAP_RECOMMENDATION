import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
@Injectable()
export class LoginPage implements OnInit {

  constructor(private  authService: AuthService, private router: Router, private http: HttpClient, private alertCtrl: AlertController, private storage: Storage) {
    // this.storage.get('id').then((val) => {
    //   if (val != null) {
    //     this.router.navigateByUrl('/app/tabs/search');
    //   }
    // });
  }

  ngOnInit() {
  }

  login(form: any) {
    this.authService.login(form.value).subscribe((res) => {
      this.router.navigateByUrl('/app/tabs/search');
    });
  }
}
