import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class VisitsService {

  url_get = 'http://192.168.0.13/get_visits.php';
  url_change = 'http://192.168.0.13/update_restaurants.php';

  constructor(private http: HttpClient) { }

  searchData(title: string): Observable<any> {
    return this.http.get(`${this.url_get}?mode=${encodeURI(title)}`);
  }

  appendData(restaurant: Restaurant) {
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

    return this.http.post<Restaurant>(this.url_change, params, httpOptions).pipe(
      tap(async (res) => {
      })
    );
  }
}
