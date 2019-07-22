import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SuggestionsService {

  url = 'http://192.168.0.13/get_restaurants.php?mode=all';

  constructor(private http: HttpClient) { }

  getSuggestions(title: string): Observable<any> {
    return this.http.get(this.url);
  }
}
