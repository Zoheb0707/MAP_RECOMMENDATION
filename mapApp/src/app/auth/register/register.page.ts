import { Component, ViewChild, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController, IonSlides } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { User } from '../user';

import { AngularFireAuth } from "angularfire2/auth";

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    centeredSlides: true,
    allowTouchMove: false,
    speed: 400
  };

  public registerForms: FormGroup[] = [];

  fields = ['First name', 'Last name', 'Date of birth', 'email', 'password'];

  showButton = true;
  showBackButton = false;

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
    email: new FormControl('', Validators.compose([
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

  constructor(private authService: AuthService, private navCtrl: NavController, private formBuilder: FormBuilder,
              private fAuth: AngularFireAuth) { }

  ngOnInit() {
    this.registerForms.unshift(this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      age: ['']
    }));

    this.registerForms.unshift(this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      age: ['']
    }));
  }

  async register(form: NgForm) {
    await this.authService.register(form.value).then((res) => {
      this.navCtrl.navigateBack('/login');
    },
    (err) => {
      alert('Error!');
      console.log(err);
    });
  }

  equalsTo(fieldName: any): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

      const input = control.value;

      const isValid = control.root.value[fieldName] === input;
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

  slideForward() {
    this.slides.getActiveIndex().then((index) => {
      if (index === this.fields.length - 2) {
        this.slides.slideNext();
        this.showButton = false;
      } else {
        this.slides.slideNext();
        this.showBackButton = true;
      }
    });
  }

  slideBack() {
    this.slides.getActiveIndex().then((index) => {
      this.slides.slidePrev();
      if (index === 1) {
        this.showBackButton = false;
      } else if (index === this.fields.length - 1) {
        this.showButton = true;
      }
    });
  }

}
