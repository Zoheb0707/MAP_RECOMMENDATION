import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { AuthService } from '../auth.service';
import { NavController, IonSlides, PickerController, IonDatetime  } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm, ValidatorFn, AbstractControl } from '@angular/forms';
import { User } from '../user';
import { PickerOptions } from '@ionic/core';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild(IonSlides) slides;
  @ViewChild(IonDatetime) dateTime: IonDatetime;

  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    centeredSlides: true,
    // allowTouchMove: false,
    speed: 200
  };

  foodPreferences = [{name: 'Vietnam', selected: false}, {name: 'Greece', selected: false}, {name: 'Italy', selected: false},
                     {name: 'Pakistan', selected: false}, {name: 'Philippines', selected: false}, {name: 'Thailand', selected: false},
                     {name: 'Japan', selected: false}, {name: 'Ukraine', selected: false}, {name: 'China', selected: false},
                     {name: 'India', selected: false}, {name: 'Spain', selected: false}, {name: 'France', selected: false},
                     {name: 'Mexico', selected: false}, {name: 'Switzerland', selected: false}, {name: 'Portugal', selected: false},
                     {name: 'Korea', selected: false}, {name: 'Sweden', selected: false}, {name: 'Montenegro', selected: false},
                     {name: 'Australia', selected: false}, {name: 'USA', selected: false}];

  private NUMBER_OF_SLIDES = 4;

  showButton = [true, false, false];
  showBackButton = false;
  showSubmit = false;

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
    ])),
    date_of_birth: new FormControl('')
  });

  user: User;

  constructor(private authService: AuthService, private navCtrl: NavController, private formBuilder: FormBuilder,
              private fAuth: AngularFireAuth, private pickerCtrl: PickerController) { }

  ngOnInit() {}

  ionViewDidEnter() {
  }

  async register(form: NgForm) {
    await this.authService.register(form.value).then(async (res) => {
      this.navCtrl.navigateBack('/login');
    },
    (err) => {
      alert('Error!');
      console.log(err);
    });
  }

  returnToLogIn() {
    this.navCtrl.navigateBack('/login');
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
    };
  }

  back() {
    this.navCtrl.navigateBack('login');
  }

  // Swipe slide right
  async slideForward() {
    this.slides.getActiveIndex().then((index) => {
      if (index === this.NUMBER_OF_SLIDES - 2) {
        this.showButton[index] = false;
        this.showSubmit = true;
      } else if (index === 0) {
        this.showBackButton = true;
        this.showButton[0] = false;
        this.showButton[1] = true;
      } else {
        this.showButton[index] = false;
        this.showButton[index + 1] = true;
      }
      this.slides.slideNext();
    });
  }

  async slideForwardwithEmailCheck(email: any) {
    this.fAuth.auth.fetchSignInMethodsForEmail(email.value)
    .then(async (response) => {
      if (response.length === 0) {
        this.slideForward();
      } else {
        await alert('You already have an account');
        this.navCtrl.navigateBack('/login');
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  slideBack() {
    this.slides.getActiveIndex().then((index) => {
      if (index === 1) {
        this.showBackButton = false;
        this.showButton[1] = false;
        this.showButton[0] = true;
      } else if (index === this.NUMBER_OF_SLIDES - 1) {
        this.showSubmit = false;
        this.showButton[index - 1] = true;
      } else {
        this.showButton[index] = false;
        this.showButton[index - 1] = true;
      }
      this.slides.slidePrev();
    });
  }

  async showPicker() {
    const date = new Date();
    date.setFullYear(date.getFullYear() - 12);
    this.dateTime.max = date.toISOString();
    this.dateTime.open();
  }

  arrayOf(n: number): any[] {
    const arr = Array.apply(null, {length: n}).map(Number.call, Number);
    return(arr);
  }

  getSubarray(n: number): any[] {
    const currentIndex = n * 5;
    const toReturn = this.foodPreferences.slice(currentIndex, currentIndex + 5);
    // console.log(currentIndex);
    // console.log(toReturn);
    return toReturn;
  }

  selectPreference(element) {
    if (element.selected === true) {
      element.selected = false;
    } else {
      element.selected = true;
    }
  }
}
