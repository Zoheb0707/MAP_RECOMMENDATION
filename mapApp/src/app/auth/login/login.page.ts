import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private  router: Router) { }

  ngOnInit() {
  }

  async navTabs() {
    //you can use either of below
    this.router.navigateByUrl('/app/tabs/search');
    //this.navCtrl.navigateRoot('/app/tabs/(home:home)')
  }
}
