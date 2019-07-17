import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { VisitsService } from '../services/visits.service';
import { Restaurant } from './restaurant';
import { restoreView } from '@angular/core/src/render3';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  results: Observable<any>;

  // public listOfPlaces: Array<Restaurant>;

  constructor(private  router: Router, private http: HttpClient, private visitsService: VisitsService, private storage: Storage) {}

  ngOnInit() {
    this.updateList();
  }

  back() {
    this.router.navigateByUrl('/app/tabs/search');
  }


  doRefresh(event) {
    setTimeout(() => {
      this.updateList();
      event.target.complete();
    }, 500);
  }

  updateList() {
    // this.storage.get('ID').then((val: string) => {
    //   this.results = this.visitsService.searchData(val);
    //   this.visitsService.searchData(val).subscribe(res => {
    //     res.forEach((val) => {
    //       const currentRest = new Restaurant(val);
    //       if (!this.listOfPlaces.includes(currentRest)) {
    //         this.listOfPlaces.push(currentRest);
    //         console.log('Updated!');
    //         console.log(this.listOfPlaces);
    //       }
    //     });
    //   });
    // });

    this.storage.get('ID').then((val: string) => {
      this.results = this.visitsService.searchData(val);
    });
  }
}
