import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable, BehaviorSubject } from 'rxjs';

import { Storage } from '@ionic/storage';
import { User } from './user';

import * as firebase from 'firebase/app';
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
            dob: user.date_of_birth,
            city: 'Seattle, WA',
            preferences: ['Pf1', 'Pf2', 'Pf3', 'Pf4', 'Pf5'],
            visits: []
          });

          this.fAuth.auth.currentUser.sendEmailVerification();
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
              resolve(res);
            });
          } else {
            reject(res);
          }
        },
        err => reject(err));
    });
  }

  async logout() {
    this.fAuth.auth.signOut()
    .then(() => {
    })
    .catch((error) => {
      console.log(error);
    });
  }

  isLoggedIn() {
    // function to check if logged in
  }

  async isRemembered() {
    return await this.storage.get('EMAIL');
  }

  loadUserInfo() {
    console.log('Store called');
    const currentUser = this.fAuth.auth.currentUser;
    this.storage.set('ID', currentUser.uid);
    this.storage.set('FIRST_NAME', "Name");
    this.storage.set('LAST_NAME', 'Surname');
    this.storage.set('LOCATION', 'Seattle, WA');
    this.storage.set('PREFERENCES', ['Pf1','Pf2']);
    console.log('Stored everything!');
  }

  verifyUser() {
    const currentUser = this.fAuth.auth.currentUser;
    currentUser.sendEmailVerification();
  }

  sendEmailVerification() {
    const currentUser = firebase.auth().currentUser;
    currentUser.sendEmailVerification();
  }

  // Try new things
  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential>{
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  // Get user
  async getUser() {
    return firebase.firestore().collection('users').doc(this.fAuth.auth.currentUser.uid).get();
  }
}
