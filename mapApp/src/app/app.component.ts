import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireAuth } from 'angularfire2/auth';
import { AuthUser } from './providers/auth-user';

import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public fAuth: AngularFireAuth,
    public navCtrl: NavController,
    public authUser: AuthUser,
    public router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.fAuth.authState.subscribe( (user) => {
        if (user) {
          this.authUser.setUser(user.uid).then(() => {
            console.log('Logged In');
            this.router.navigate(['/app/tabs/search']);
            // this.navCtrl.navigateRoot('/app/tabs/search');
          });
        } else {
          console.log('Not Logged In');
        }
      });
    });
  }
}
