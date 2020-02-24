import { Component, OnInit } from "@angular/core";
import { Injectable } from "@angular/core";
import {
  NavController,
  AlertController,
  LoadingController
} from "@ionic/angular";
import { AuthService } from "../auth.service";
import { Storage } from "@ionic/storage";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  NgForm,
  ValidatorFn,
  AbstractControl
} from "@angular/forms";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"]
})
export class LoginPage implements OnInit {
  private loadingMessage: HTMLIonLoadingElement;
  passwordType = "password";
  passwordIcon = "eye-off";

  loginForm = this.formBuilder.group({
    email: new FormControl("", Validators.compose([Validators.required])),
    password: new FormControl("", Validators.compose([Validators.required])),
    isRemembered: new FormControl(false)
  });

  constructor(
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    public navCtrl: NavController,
    private storage: Storage,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.storage.get("email").then(email => {
      if (email !== undefined) {
        this.loginForm.controls.email.setValue(email);
      }
    });
  }

  async login(form: NgForm) {
    // Create and present loggin-in message
    this.loadingMessage = await this.loadingCtrl.create({
      message: "Loggin-in",
      spinner: 'crescent'
    });
    await this.loadingMessage.present();

    // Try log-in
    this.authService
      .loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then(
        // Success
        res => {
          // If user is verified
          if (res.user.emailVerified) {
            if (this.loginForm.value.isRemembered) {
              this.storage.set("email", this.loginForm.value.email);
            } else {
              this.storage.set("email", "");
            }
            this.loadingMessage.dismiss().then(() => {
              // this.loginForm.controls.password.reset();
              this.navCtrl.navigateRoot("/app/tabs/search");
            });
          }
          // If user is not verified
          else {
            this.loadingMessage.dismiss().then(async () => {
              const errorMessage = await this.alertCtrl.create({
                message: "Verify your e-mail first",
                buttons: [{ text: "OK", role: "cancel" }]
              });
              await errorMessage.present();
              this.authService.sendEmailVerification();
              // this.loginForm.controls.password.reset();
            });
          }
        },
        // Error
        err => {
          this.loadingMessage.dismiss().then(async () => {
            const errorMessage = await this.alertCtrl.create({
              message: err.message,
              buttons: [{ text: "OK", role: "cancel" }]
            });
            await errorMessage.present();
            this.loginForm.controls.password.reset();
          });
        }
      );
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === "text" ? "password" : "text";
    this.passwordIcon = this.passwordIcon === "eye-off" ? "eye" : "eye-off";
  }
}
