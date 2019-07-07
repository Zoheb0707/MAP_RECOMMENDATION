import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { VisitsService } from '../services/visits.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  results: Observable<any>;

  constructor(private  router: Router, private http: HttpClient, private visitsService: VisitsService, private storage: Storage) {}

  ionViewWillEnter() {
    this.storage.get('id').then((val: string) => {
      this.results = this.visitsService.searchData(val);
    });
  } 

  back() {
    this.router.navigateByUrl('/app/tabs/search');
  }
}
