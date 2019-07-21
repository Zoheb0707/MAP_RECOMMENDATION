import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';
import { User } from './user';
import { AuthResponse } from './auth-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_SERVER_ADDRESS = 'http://192.168.0.13:80';
  authSubject = new BehaviorSubject(false);

  constructor(private  httpClient: HttpClient, private  storage: Storage) { }

  register(user: User): Observable<AuthResponse> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const params = new HttpParams({
      fromObject: {
        mode: 'new',
        user_id: user.user_id,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });

    return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/update_users.php`, params, httpOptions).pipe(
      tap(async (res: AuthResponse ) => {

        if (res.user) {
          await this.storage.set('EXPIRES_IN', res.user.expires_in);
          await this.storage.set('ID', res.user.user_id);
          await this.storage.set('FIRST_NAME', res.user.first_name);
          await this.storage.set('LAST_NAME', res.user.last_name);
          this.authSubject.next(true);
        }
      })

    );
  }

  login(user: User): Observable<AuthResponse> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    const params = new HttpParams({
      fromObject: {
        user_id: user.user_id,
        password: user.password
      }
    });

    return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/authenticate.php`, params, httpOptions).pipe(
      tap(async (res: AuthResponse) => {

        if (res.user) {
          await this.storage.set('EXPIRES_IN', res.user.expires_in);
          await this.storage.set('ID', res.user.user_id);
          await this.storage.set('FIRST_NAME', res.user.first_name);
          await this.storage.set('LAST_NAME', res.user.last_name);
          this.authSubject.next(true);
        }
      })
    );
  }

  async logout() {
    await this.storage.remove('EXPIRES_IN');
    await this.storage.remove('ID');
    await this.storage.remove('FIRST_NAME');
    await this.storage.remove('LAST_NAME');
    this.authSubject.next(false);
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
