import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { NavController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
@Injectable()
export class LoginPage implements OnInit {

  private loadingMessage: HTMLIonLoadingElement;

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
  }

  async login(form: NgForm) {
    // Create and present loggin-in message
    this.loadingMessage = await this.loadingCtrl.create({
      message: 'Loggin-in'
    });
    await this.loadingMessage.present();

    // Try log-in
    this.authService.loginUser(form.value.email, form.value.password).then(
    // Success
    (res) => {
      // If user is verified
      if (res.user.emailVerified) {
        this.loadingMessage.dismiss().then(() => {
          // form.controls.password.reset();
          this.navCtrl.navigateForward('/app/tabs/search');
        });
      }
      // If user is not verified
      else {
        this.loadingMessage.dismiss().then(
          async () => {
            const errorMessage = await this.alertCtrl.create({
              message: 'Verify your e-mail first',
              buttons: [{text: 'OK', role: 'cancel'}]
            });
            await errorMessage.present();
            this.authService.sendEmailVerification();
            // form.controls.password.reset();
          }
        );
      }
    },
    // Error
    (err) => {
      this.loadingMessage.dismiss().then(
        async () => {
          const errorMessage = await this.alertCtrl.create({
            message: err.message,
            buttons: [{text: 'OK', role: 'cancel'}]
          });
          await errorMessage.present();
          // form.controls.password.reset();
        }
      );
    });
  }
}
