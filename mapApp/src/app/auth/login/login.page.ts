import { Component, OnInit } from "@angular/core";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { NavController, AlertController } from "@ionic/angular";
import { Storage } from "@ionic/storage";
import { AuthService } from "../auth.service";

import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
@Injectable()
export class LoginPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private storage: Storage,
    private navCtrl: NavController,
    private fAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    let user = this.fAuth.auth.currentUser;
    this.isRemembered();
    console.log(user);
  }

  async isRemembered() {
    await this.authService.isRemembered().then((res) => {
      console.log(res);
    });
  }

  async login(form: any) {
    await this.authService.login(form.value).then((res) => {
      this.navCtrl.navigateForward('/app/tabs/search');
    },
    (err) => {
      alert('Error!');
      console.log(err);
    });
  }
}
