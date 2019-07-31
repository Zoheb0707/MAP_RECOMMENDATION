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

          const currentUser = this.fAuth.auth.currentUser;
          currentUser.sendEmailVerification();
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
          if (res.user.emailVerified) {
            this.fStone.collection('users').doc(res.user.uid).valueChanges().subscribe((data: User) => {
              this.loadUserInfo(res.user.uid, data).then(
                () => resolve(res)
              );
            });
          } else {
            reject(res);
          }
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
    }).catch((error) => {
      // An error happened.
    });
  }

  isLoggedIn() {
    // function to check if logged in
  }

  async isRemembered() {
    return await this.storage.get('EMAIL');
  }

  private async loadUserInfo(uid: string, user: User) {
    console.log('Store called');
    await this.storage.set('ID', uid);
    await this.storage.set('FIRST_NAME', user.name.first);
    await this.storage.set('LAST_NAME', user.name.last);
    await this.storage.set('LOCATION', user.city);
    await this.storage.set('PREFERENCES', user.preferences);
    console.log('Stored everything!');
  }

  verifyUser() {
    const currentUser = this.fAuth.auth.currentUser;
    currentUser.sendEmailVerification();
  }
}
