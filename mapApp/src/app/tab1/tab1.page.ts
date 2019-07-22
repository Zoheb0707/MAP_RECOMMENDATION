import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { VisitsService } from '../services/visits.service';
import { Events, LoadingController, ActionSheetController  } from '@ionic/angular';
import { Restaurant } from './restaurant';
import { AlertController } from '@ionic/angular';


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
  debug = false;
  sortingOption = undefined;

  constructor(private router: Router, private http: HttpClient, private visitsService: VisitsService, private storage: Storage, 
              private loadingController: LoadingController, private alertController: AlertController, 
              private actionSheetController: ActionSheetController, private events: Events) { }

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
    this.storage.get('ID').then((val: string) => {
      this.visitsService.searchData(val).subscribe(
        // If result is loaded
        (answ) => {
          console.log('answ');
          // Subscribe new list of restaurants
          this.pastVisits = answ;
          this.sortVisits(this.sortingOption);
          // If refresh
          if (event !== undefined) {
            event.target.complete();
          } else {
            this.loadingController.dismiss();
          }
        },
        // If there was an error connecting to the server
        (err) => {
          console.log('err');
          if (event !== undefined) {
            event.target.complete();
          } else {
            this.loadingController.dismiss();
          }
          this.presentServerError();
        }
      );
    });
  }

  showRestaurants() {
    let name = Math.floor(Math.random() * Math.floor(100));
    // this.pastVisits.push({restaurant_id: name});
    this.visitsService.appendData({restaurant_id: name, times: 1}).subscribe((answ) => {
    });
  }

  async presentServerError() {
    const alert = await this.alertController.create({
      header: 'Can not get past visits',
      message: 'There was an error connecting to the server.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async sortVisits(option: string) {
    switch (option) {
      case 'alphabetic': {
        this.pastVisits.sort((r1, r2) => r1.restaurant_id.localeCompare(r2.restaurant_id));
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

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Sorting Options',
      buttons: [{
        text: 'Name',
        handler: () => {
          this.sortingOption = 'alphabetic';
          this.sortVisits(this.sortingOption);
        }
      }, {
        text: 'Times',
        handler: () => {
          this.sortingOption = 'times';
          this.sortVisits(this.sortingOption);
        }
      }, {
        text: 'Rating',
        handler: () => {
          this.sortingOption = 'rating';
          this.sortVisits(this.sortingOption);
        }
      }, {
        text: 'Back',
        role: 'destructive',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }
}
