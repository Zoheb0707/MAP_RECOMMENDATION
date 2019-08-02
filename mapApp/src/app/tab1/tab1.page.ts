import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { VisitsService } from '../services/visits.service';
import { Events, LoadingController, ActionSheetController, AlertController  } from '@ionic/angular';
import { Restaurant } from './restaurant';
import { User } from '../auth/user';

import { AuthUser } from '../providers/auth-user';


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
  pastVisitsTwo = [];
  debug = false;
  sortingOption = 'date';

  constructor(private router: Router, private http: HttpClient, private visitsService: VisitsService, private storage: Storage, 
              private loadingController: LoadingController, private alertController: AlertController,
              private actionSheetController: ActionSheetController, private events: Events, private userAuth: AuthUser) { }

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

    // Update visits of authenticated user
    this.userAuth.reloadVisits().then(async () => {
      // If there was a change in visits
      if (this.userAuth.isUpdated()) {
        // TO-DO: not reload all of the visits, instead reload only new ones
        // Reset the past visits array
        const refreshedPastVisits = [];
        for (const element of this.userAuth.getUser().visits) {
          await element.get().then(async (res) => {
            refreshedPastVisits.push(res.data());
          });
        }
        // Assign new visits
        this.pastVisitsTwo = refreshedPastVisits;
        // Sort results
        this.sortVisits(this.sortingOption);
      }

      // If refresh
      if (event !== undefined) {
        event.target.complete();
      } else {
        this.loadingController.dismiss();
      }
    });
  }

  showRestaurants() {
    let name = Math.floor(Math.random() * Math.floor(100));
    // this.pastVisits.push({restaurant_id: name});
    this.visitsService.appendData({restaurant_id: name, times: 1}).subscribe((answ) => {
    });
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
  sortVisits(option: string) {
    switch (option) {
      case 'alphabetic': {
        this.pastVisitsTwo.sort((r1, r2) => r1.name.localeCompare(r2.name));
        break;
      }

      case 'date': {
        this.pastVisitsTwo.sort((r1, r2) => +r1.date.seconds > +r2.date.seconds ? -1 : +r1.date.seconds < +r2.date.seconds ? 1 : 0);
        break;
      }

      case 'times': {
        this.pastVisits.sort((r1, r2) => +r1.times > +r2.times ? -1 : +r1.times < +r2.times ? 1 : 0);
        break;
      }

      case 'rating': {
        this.pastVisits.sort((r1, r2) => +r1.avg_rating > +r2.avg_rating ? -1 : +r1.avg_rating < +r2.avg_rating ? 1 : 0);
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
          this.sortVisits(this.sortingOption);
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
          this.sortVisits(this.sortingOption);
        }
      }, 
      // {
      //   text: 'Rating',
      //   handler: () => {
      //     this.sortingOption = 'rating';
      //     this.sortVisits(this.sortingOption);
      //   }
      // },
      {
        text: 'Back',
        role: 'destructive',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  async getVisits() {
    this.storage.get('ID').then(async (uid: string) => {
      this.visitsService.getVisits(uid).subscribe(async (res: User) => {
        this.pastVisitsTwo = await Promise.all(res.visits.map(async (val) => {
          await val.get().then(async (dat) => {
            console.log(dat.data());
            return await dat.data();
          });
        }));
      });
    });
  }

  addVisit() {
    this.presentNameForNewPlace().then((res) => {
      if (res.data.name !== undefined) {
        this.userAuth.addVisit(res.data.name).then(() => {
          this.reloadVisits();
        });
      }
    });
  }

  async presentNameForNewPlace() {
    let choice: any;
    const alert = await this.alertController.create({
      header: 'What is the name of the place?',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        }
      ],
      buttons: [
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

    return choice;
  }
}
