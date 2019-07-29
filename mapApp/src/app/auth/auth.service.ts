import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';
import { User } from './user';
import { AuthResponse } from './auth-response';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  AUTH_SERVER_ADDRESS = 'https://73.53.29.38:80';

  authSubject = new BehaviorSubject(false);

  constructor(private  httpClient: HttpClient, private  storage: Storage, private fAuth: AngularFireAuth,
              private fStone: AngularFirestore, private db: AngularFireDatabase) { }

  register(user: User) {

    return new Promise<any>((resolve, reject) => {
      this.fAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(
        (res) => {
          resolve(res);
        },
        err => reject(err));
    });

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   })
    // };

    // const params = new HttpParams({
    //   fromObject: {
    //     mode: 'new',
    //     user_id: user.user_id,
    //     password: user.password,
    //     first_name: user.first_name,
    //     last_name: user.last_name
    //   }
    // });

    // return this.httpClient.post<AuthResponse>(`${this.AUTH_SERVER_ADDRESS}/update_users.php`, params, httpOptions).pipe(
    //   tap(async (res: AuthResponse ) => {

    //     if (res.user) {
    //       await this.storage.set('EXPIRES_IN', res.user.expires_in);
    //       await this.storage.set('ID', res.user.user_id);
    //       await this.storage.set('FIRST_NAME', res.user.first_name);
    //       await this.storage.set('LAST_NAME', res.user.last_name);
    //       this.authSubject.next(true);
    //     }
    //   })

    // );
  }

  async login(user: User) {

    return new Promise<any>((resolve, reject) => {
      this.fAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(
        (res) => {
          console.log(res.user.uid);
          this.fStone.collection('users').doc(res.user.uid).valueChanges().subscribe(data => {
            this.storage.set('ID', res.user.uid);
            this.storage.set('FIRST_NAME', data.name.first);
            this.storage.set('LAST_NAME', data.name.last);
            this.storage.set('LOCATION', data.city);
            this.authSubject.next(true);
          });
          resolve(res);
        },
        err => reject(err));
    });

    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type': 'application/x-www-form-urlencoded'
    //   })
    // };

    // const params = new HttpParams({
    //   fromObject: {
    //     user_id: user.user_id,
    //     password: user.password
    //   }
    // });

    // return this.httpClient.post(`${this.AUTH_SERVER_ADDRESS}/authenticate.php`, params, httpOptions).pipe(
    //   tap(async (res: AuthResponse) => {

    //     if (res.user) {
    //       await this.storage.set('EXPIRES_IN', res.user.expires_in);
    //       await this.storage.set('ID', res.user.user_id);
    //       await this.storage.set('FIRST_NAME', res.user.first_name);
    //       await this.storage.set('LAST_NAME', res.user.last_name);
    //       this.authSubject.next(true);
    //     }
    //   })
    // );
  }

  async logout() {
    this.fAuth.auth.signOut().then(() => {
      this.storage.remove('EXPIRES_IN');
      this.storage.remove('ID');
      this.storage.remove('FIRST_NAME');
      this.storage.remove('LAST_NAME');
      this.authSubject.next(false);
    }).catch((error) => {
      // An error happened.
    });
  }

  isLoggedIn() {
    return this.authSubject.asObservable();
  }
}
