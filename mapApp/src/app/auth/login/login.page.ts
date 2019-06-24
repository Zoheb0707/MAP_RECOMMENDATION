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

  navTabs(form) {
    if (form.value.email === 'root' && form.value.password === 'root') {
      this.router.navigateByUrl('/app/tabs/search');
    } else {
      alert('Wrong Credentials!');
    }
  }
}
