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
        await firebase.firestore().collection('users').doc(uid).get().then(async (res) => {
            this.user.visitsTwo = res;
            this.user.uid = uid;
            this.user.name = await res.data().name;
            this.user.city = await res.data().city;
            this.user.preferences = await res.data().preferences;
            this.user.visits = await res.data().visits;
            this.wasUpdated = true;
            console.log('Loaded user profile');
        });
    }

    async reloadVisits() {
        await firebase.firestore().collection('users').doc(this.user.uid).get().then((res) => {
            if (!res.isEqual(this.user.visitsTwo)) {
                this.user.visitsTwo = res;
                if (res.data().visits !== undefined) {
                    this.user.visits = res.data().visits;
                    console.log(this.user.visits);
                } else {
                    this.user.visits = [];
                    console.log(this.user.visits);
                }
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

    async addVisit(placeId: string) {
        const date = new Date();
        const visitName = this.user.uid + '_' + placeId + '_' + date.getTime();
        // +1 db call
        await firebase.firestore().collection('visits').doc(visitName).set({
            uid: this.user.uid,
            date: firebase.firestore.Timestamp.fromDate(date),
            pid: placeId,
            name: placeId
        })
        .then(async () => {
            // +2 db call
            await this.user.visits.push(firebase.firestore().collection('visits').doc(visitName));
            // +3 db call
            await firebase.firestore().collection('users').doc(this.user.uid).update({
                visits: this.user.visits
            })
            .then(() => {
                console.log('added', visitName);
                this.wasUpdated = true;
            })
            .catch((err) => {
                console.log(err);
            });
        })
        .catch((err) => {
            console.log(err);
        });

    }
}