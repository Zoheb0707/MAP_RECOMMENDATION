import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { VisitsService } from '../services/visits.service';
import { Loading, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  /**
   * Stores a list of previously visited restaurants
   */
  pastVisits: Observable<any>;

  constructor(private router: Router, private http: HttpClient, private visitsService: VisitsService, private storage: Storage, 
              private loadingController: LoadingController) { }

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
        message: 'Loading your visits',
        duration: 10000
      });
      await loading.present();
    }
    this.storage.get('ID').then((val: string) => {
      this.pastVisits = this.visitsService.searchData(val);
      if (event !== undefined) {
        event.target.complete();
      } else {
        this.loadingController.dismiss();
      }
    });
  }
}
