import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(private  authService: AuthService, private navCtrl: NavController) { }

  ngOnInit() {
  }

  register(form: any) {
    this.authService.register(form.value).subscribe((res) => {
      this.navCtrl.navigateForward('/app/tabs/search');
    });
  }

}
