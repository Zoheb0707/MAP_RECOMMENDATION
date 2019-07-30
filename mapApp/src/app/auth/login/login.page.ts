import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
@Injectable()
export class LoginPage implements OnInit {
  constructor(
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
  }

  async login(form: any) {
    await this.authService.login(form.value).then((resp) => {
      if (resp.user.emailVerified) {
        this.navCtrl.navigateForward('/app/tabs/search');
      } else {
        alert('Verify email first!');
        this.authService.verifyUser();
      }
    },
    (err) => {
      alert('Error!');
      console.log(err);
    });
  }
}
