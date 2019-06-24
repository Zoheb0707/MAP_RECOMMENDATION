import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-searches',
  templateUrl: './searches.page.html',
  styleUrls: ['./searches.page.scss'],
})
export class SearchesPage implements OnInit {

  constructor(private  router: Router) { }

  ngOnInit() {
  }

  back() {
    this.router.navigateByUrl('/app/tabs/search');
  }
}
