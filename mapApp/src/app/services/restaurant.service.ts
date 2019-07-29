import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {

  url_get = 'https://73.53.29.38:80/get_restaurants.php';

  constructor(private http: HttpClient) { }

  getInfo(restaurantId: string): Observable<any> {
    return this.http.get(`${this.url_get}?mode=one&restaurant=${encodeURI(restaurantId)}`).pipe(
      timeout(10000)
    );
  }
}
