import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { SuggestionsService } from '../services/suggestions.service';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-searches',
  templateUrl: './searches.page.html',
  styleUrls: ['./searches.page.scss'],
})
export class SearchesPage implements OnInit {

  results: Observable<any>;

  constructor(private  router: Router, private http: HttpClient, private suggestions: SuggestionsService, private storage: Storage, 
              private navCtrl: NavController) { }

  ngOnInit() {
      this.storage.get('ID').then((val: string) => {
        this.results = this.suggestions.getSuggestions(val);
      });

  }

  back() {
    this.navCtrl.navigateBack('app/tabs/search');
  }
}
