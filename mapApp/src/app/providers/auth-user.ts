import {Injectable} from '@angular/core';
import { Visit } from './visit';
import { User } from './user';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthUser {

    private user: User;
    private wasUpdated: boolean;

    constructor() {
        this.user = {
            uid : '',
            name: {first: '', last: ''},
            city: '',
            preferences: [],
            visits: [],
            visitsTwo: undefined
        };
        this.wasUpdated = false;
    }

    async setUser(uid: string) {
        await firebase.firestore().collection('users').doc(uid).get().then((res) => {
            this.user.visitsTwo = res;
            this.user.uid = uid;
            this.user.name = res.data().name;
            this.user.city = res.data().city;
            this.user.preferences = res.data().preferences;
            this.user.visits = res.data().visits;
            this.wasUpdated = true;
            console.log('Loaded user profile');
        });
    }

    async reloadVisits() {
        await firebase.firestore().collection('users').doc(this.user.uid).get().then((res) => {
            if (!res.isEqual(this.user.visitsTwo)) {
                this.user.visitsTwo = res;
                this.user.visits = res.data().visits;
                this.wasUpdated = true;
                console.log('Reloaded visits');
            } else {
                // Do nothing
            }
        });
    }

    isUpdated() {
        if (this.wasUpdated) {
            this.wasUpdated = false;
            return true;
        } else {
            return false;
        }
    }

    getUser() {
        return this.user;
    }
}