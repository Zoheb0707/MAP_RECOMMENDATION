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

  async register(user: any) {

    return await new Promise<any>((resolve, reject) => {
      this.fAuth.auth.createUserWithEmailAndPassword(user.email, user.password)
      .then(
        (res) => {
          this.fStone.collection('users').doc(res.user.uid).set({
            name: {
              first: user.first_name,
              last: user.last_name
            },
            city: 'Seattle, WA',
            preferences: ['Pf1', 'Pf2', 'Pf3', 'Pf4', 'Pf5']
          });
          this.storage.set('ID', res.user.uid);
          this.storage.set('FIRST_NAME', user.first_name);
          this.storage.set('LAST_NAME', user.last_name);
          this.storage.set('LOCATION', 'Seattle, WA');
          this.storage.set('PREFERENCES', ['Pf1', 'Pf2', 'Pf3', 'Pf4', 'Pf5']);
          this.authSubject.next(true);
          resolve(res);
        },
        err => reject(err));
    });
  }

  async login(user: User) {

    return new Promise<any>((resolve, reject) => {
      this.fAuth.auth.signInWithEmailAndPassword(user.email, user.password)
      .then(
        (res) => {
          this.fStone.collection('users').doc(res.user.uid).valueChanges().subscribe((data: User) => {
            this.storage.set('ID', res.user.uid);
            this.storage.set('FIRST_NAME', data.name.first);
            this.storage.set('LAST_NAME', data.name.last);
            this.storage.set('LOCATION', data.city);
            this.storage.set('PREFERENCES', data.preferences);
            this.authSubject.next(true);
          });
          resolve(res);
        },
        err => reject(err));
    });
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

  async isRemembered() {
    return await this.storage.get('EMAIL');
  }
}
