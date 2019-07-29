import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, timeout, timeoutWith, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {

  url_get = 'https://73.53.29.38:80/get_visits.php';
  url_change = 'https://73.53.29.38:80/update_restaurants.php';

  constructor(private http: HttpClient) { }

  searchData(title: string): Observable<any> {
    return this.http.get(`${this.url_get}?mode=${encodeURI(title)}`).pipe(
      timeout(10000)
    );
  }

  appendData(restaurant) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const params = new HttpParams({
      fromObject: {
        mode: 'new',
        restaurant: restaurant.restaurant_id,
        name: restaurant.restaurant_id,
        type: restaurant.restaurant_id,
        location: restaurant.restaurant_id
      }
    });

    return this.http.post(this.url_change, params, httpOptions).pipe(
      tap(async (res) => {
      })
    );
  }
}
