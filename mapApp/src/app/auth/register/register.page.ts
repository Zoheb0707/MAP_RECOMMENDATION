import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { User } from '../user';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  registerForm = this.formBuilder.group({
    first_name: new FormControl('', Validators.compose([
      Validators.maxLength(30),
      Validators.pattern('[a-zA-Z ]*'),
      Validators.required
    ])),
    last_name: new FormControl('', Validators.compose([
      Validators.maxLength(30),
      Validators.pattern('[a-zA-Z ]*'),
      Validators.required
    ])),
    user_id: new FormControl('', Validators.compose([
      Validators.required,
      Validators.email
    ])),
    password: new FormControl('', Validators.compose([
      Validators.minLength(5),
      Validators.required,
      Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
    ])),
    confirm: new FormControl('', Validators.compose([
      Validators.required,
      this.equalsTo('password')
    ]))
  });

  user: User;

  constructor(private authService: AuthService, private navCtrl: NavController, private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  register(form: NgForm) {
    this.user = form.value;
    this.authService.register(form.value).subscribe((res) => {
      this.navCtrl.navigateForward('/app/tabs/search');
    },
    (err) => {
      if (err.status === 409) {
        alert('Email already exists!');
      }
    });
  }

  equalsTo(field_name: any): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

      const input = control.value;

      const isValid = control.root.value[field_name] === input;
      if (!isValid) {
        return { equalTo: {isValid}};
      } else {
        return null;
      }
    }
  }

  back() {
    this.navCtrl.navigateBack('login');
  }

}
