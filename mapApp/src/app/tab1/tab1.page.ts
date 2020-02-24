import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { VisitsService } from '../services/visits.service';
import { Events, LoadingController, ActionSheetController, AlertController  } from '@ionic/angular';
import { Restaurant } from './restaurant';

import { AuthUser } from '../providers/auth-user';
import { Visit } from '../providers/visit-interface';
import { VisitObject } from '../providers/visit-object';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  /**
   * Stores a list of previously visited restaurants
   */
  pastVisits: Restaurant[];
  // Currently rendering this
  pastVisitsTwo: Visit[];
  // debug of new features
  debug = false;
  // sorting option
  sortingOption = 'date';
  // availiable places
  places = ['RAM Restaurant & Brewery - University Village', 'CaliBurger', "Taste of Xi'an", "Costa's", 'Hawaii BBQ', 'Red Pepper', 'Oasis Tea Zone', 'Little Kitchen', 'Sureshot Cafe', 'Starbucks', 'By George', 'Chipotle', 'Aladdin Gyro-cery & Deli', 'Saigon Deli', 'Pho Shizzle Too!', "Finn MacCool's", 'China First', 'Bulldog News', 'Rancho Bravo Tacos', 'Samurai Noodle', 'Best of Bento', 'Pho Than Brothers', 'Flowers', 'The Block', 'Ichiro', 'Pho Tran', 'Starbucks', 'University Kitchen', 'Subway', "Henry's Taiwan Kitchen", "Guanaco's Tacos & Pupuseria", 'Green House', 'Thai65', "Jimmy John's", 'Cafe Solstice', 'ReBoot', 'Starbucks', 'The Northlake Tavern & Pizza House', "Voula's Offshore Cafe", 'Zoka Coffee - University', 'The Ugly Mug', 'Parnassus', 'Cafe Allegro', "Cedar's", 'Sizzle & Crunch', 'Pho Thy Thy', 'Yummy Bites', "Chili's South Indian Cousine", 'Thanh Vi', 'Slate Coffee Roasters', 'Beetle Cafe', 'Shawarma King', 'Mee Sum Pastry', 'Texians BBQ', 'Chi Mac', 'Palmi Korean BBQ', 'Starbucks', 'SomTamThai', "Jake's Coffee", 'Mei Mei Cafe', 'Nasai Teriyaki', '50 North', 'Great State Burger - Laurelhurst', 'Eureka!', 'Juice Press', 'Teavana', "Delfino's Pizza", 'Starbucks', 'Jamba Juice', 'General Porpoise Doughnuts - Laurelhurst', "Kai's Bistro & Lounge", "Samir's Mediterranean Grill", "Sarducci's Specialty Subs", 'Bambu', 'U:Don', 'Tea Republik', 'Ding Tea', 'Kung Fu Tea', 'City Grind at the Henry', 'Starbucks', 'Din Tai Fung', 'Ba Bar', "Domino's", 'Subway', 'Big Tuna', 'Qdoba', 'Cultivate', 'MOD Pizza', 'RedBean Coffee', 'Zen Noodle', 'Husky Grind', 'Subway', 'Chipotle', 'Einstein Bros. Bagels', 'Evergreens', 'Qdoba', 'Elemental Pizza - U-Village', 'Kong Tofu House', 'Sharetea', "Hiroshi's Poke", 'Kiki Bakery & Cafe', 'Hokkaido Ramen Santouka', 'Starbucks', 'Korean Tofu House', 'Jewel of India', "Yinzi's Kitchen", 'Morsel', 'Poke Lover', 'Which Wich?', 'Hunan Chinese Kitchen', 'Wann Yen', 'Royal Gaming Cafe', 'Kitanda', 'CharLaLa', 'Ma’ono Fried Chicken', 'Supreme', 'Poindexter', 'Genghis Cohen', 'Little Duck', 'Microsoft Café', 'Byrek & Bagguette', 'Pagliacci Pizza', 'Donut Factory', 'Pagliacci Pizza', 'Pagliacci Pizza', 'Jack in the Box']
  rate = 4;

  constructor(private router: Router, private http: HttpClient, private visitsService: VisitsService, private storage: Storage,
              private loadingController: LoadingController, private alertController: AlertController,
              private actionSheetController: ActionSheetController, private events: Events, private userAuth: AuthUser,
              private toastController: ToastController) { }

  ngOnInit() {
    this.reloadVisits();
  }

  /**
   * Switches current tab to the search tab
   */
  back() {
    this.router.navigateByUrl('/app/tabs/search');
  }

  /**
   * Performs refresh of past visits
   * @param event IonRefresh event
   */
  refreshVisits(event) {
    this.reloadVisits(event);
  }

  /**
   * Reloads list of past visits
   * @param [event] IonRefresh event
   */
  async reloadVisits(event?) {

    if (event === undefined) {
      const loading = await this.loadingController.create({
        message: 'Loading your visits'
      });
      await loading.present();
    }

    await this.userAuth.reloadVisits()
    .then(async () => {
      // Get updated visits
      const updatedVisits = this.userAuth.getUser().visits;
      // Sort results
      await this.sortVisits(this.sortingOption, updatedVisits);
      // Store them
      this.pastVisitsTwo = updatedVisits;
    })
    .catch( (error) => {
      console.log(error);
    });

    // If refresh
    if (event !== undefined) {
      event.target.complete();
    } else {
      this.loadingController.dismiss();
    }
  }

  /**
   * Presents error about problem with a server
   */
  async presentServerError() {
    const alert = await this.alertController.create({
      header: 'Can not get past visits',
      message: 'There was an error connecting to the server.',
      buttons: ['OK']
    });

    await alert.present();
  }

  /**
   * Sorts stored past visits in a manner specified by a passed parameter
   * @param option type of sorting
   */
  async sortVisits(option: string, visitsArray: Visit[]) {
    switch (option) {
      case 'alphabetic': {
        await visitsArray.sort((r1, r2) => r1.name.localeCompare(r2.name));
        break;
      }

      case 'date': {
        await visitsArray.sort((r1, r2) => +r1.date.seconds > +r2.date.seconds ? -1 : +r1.date.seconds < +r2.date.seconds ? 1 : 0);
        break;
      }

      // case 'times': {
      //   await visitsArray.sort((r1, r2) => +r1.times > +r2.times ? -1 : +r1.times < +r2.times ? 1 : 0);
      //   break;
      // }

      case 'rating': {
        await visitsArray.sort((r1, r2) => !r2.rating || r1.rating > r2.rating ? -1 : !r1.rating || r1.rating < r2.rating ? 1 : 0);
        break;
      }
    }
  }

  /**
   * Presents action sheet containing different sorting options
   */
  async presentSortingOptions() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Sorting Options',
      buttons: [{
        text: 'Name',
        handler: () => {
          this.sortingOption = 'alphabetic';
          this.sortVisits(this.sortingOption, this.pastVisitsTwo);
        }
      },
      // {
      //   text: 'Times',
      //   handler: () => {
      //     this.sortingOption = 'times';
      //     this.sortVisits(this.sortingOption);
      //   }
      // }, 
      {
        text: 'Date',
        handler: () => {
          this.sortingOption = 'date';
          this.sortVisits(this.sortingOption, this.pastVisitsTwo);
        }
      },
      {
        text: 'Rating',
        handler: () => {
          this.sortingOption = 'rating';
          this.sortVisits(this.sortingOption, this.pastVisitsTwo);
        }
      },
      {
        text: 'Back',
        role: 'destructive',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  // Adds a new visit
  async addVisit() {
    this.presentNameForNewPlace().then(async (res) => {
      // console.log(res);
      if (res[0].data.name !== undefined) {
        await this.userAuth.addVisit(res[0].data.name, res[1]).then(async () => {
          const updatedVisits = this.userAuth.getUser().visits;
          // Sort results
          await this.sortVisits(this.sortingOption, updatedVisits);
          // Store them
          this.pastVisitsTwo = updatedVisits;
        });
      }
    });
  }

  // Presents a pop-up window with question to type a name of the place
  async presentNameForNewPlace() {
    let choice: any;
    let stars = NaN;
    const alert = await this.alertController.create({
      header: 'What is the name of the place?',
      inputs: [
        {
          name: 'name',
          type: 'search',
          placeholder: 'Name',
        }
      ],
      buttons: [
        { text: '1', handler: data => { stars = 1; return false; }},
        { text: '2', handler: data => { stars = 2; return false; }},
        { text: '3', handler: data => { stars = 3; return false; }},
        { text: '4', handler: data => { stars = 4; return false; }},
        { text: '5', handler: data => { stars = 5; return false; }},
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            return data;
          }
        }
      ]
    });

    await alert.present();

    await alert.onDidDismiss().then(data => {
      choice = data;
    });

    return [choice, stars];
  }

  async deleteVisit(event: any, visit: VisitObject) {
    event.close();
    await this.userAuth.removeVisit(visit);
    const updatedVisits = this.userAuth.getUser().visits;
    // Sort results
    await this.sortVisits(this.sortingOption, updatedVisits);
    // Store them
    this.pastVisitsTwo = updatedVisits;
    this.presentRemovalNotification();
  }

  async presentRemovalNotification() {
    const toast = await this.toastController.create({
      showCloseButton: true,
      message: 'Your visit have been deleted.',
      duration: 2000
    });
    toast.present();
  }
}
