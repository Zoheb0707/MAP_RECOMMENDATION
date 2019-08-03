import {Injectable} from '@angular/core';
import { VisitObject } from './visit-object';
import { User } from './user';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AuthUser {

    private user: User;
    private wasUpdated: boolean;
    // Document references to all rendered visits
    private renderedReferences: firebase.firestore.DocumentReference[];
    // Stores a snapshot of a user document for future comparissons
    private documentSnapshot: firebase.firestore.DocumentSnapshot;

    constructor() {
        this.user = {
            uid : '',
            name: {first: '', last: ''},
            city: '',
            preferences: [],
            visits: [],
            visitsTwo: undefined,
            visitsThree: []
        };
        this.renderedReferences = [];
        this.wasUpdated = false;
        this.documentSnapshot = undefined;
    }

    async setUser(uid: string) {
        await firebase.firestore().collection('users').doc(uid).get().then(async (res) => {
            this.user.visitsTwo = res;
            this.user.uid = uid;
            this.user.name = await res.data().name;
            this.user.city = await res.data().city;
            this.user.preferences = await res.data().preferences;
            await this.reloadVisits();
            this.wasUpdated = true;
            console.log('Loaded user profile');
        });
    }

    // Reloads visits
    async reloadVisits() {

        await firebase.firestore().collection('users').doc(this.user.uid).get()
        .then(async (response) => {
            if (this.documentSnapshot === undefined || !response.isEqual(this.documentSnapshot)) {
                // Save document snapshot
                this.documentSnapshot = response;
                // Load new visits
                const newVisits = await response.get('visits');
                console.log('newVisits', newVisits);
                console.log('rendered', this.renderedReferences);

                // Find if there are any new elements
                const elementsToAdd = this.findDifferences(newVisits, this.renderedReferences);

                // Find if there are any elements to delete
                const elementsToRemove = this.findDifferences(this.renderedReferences, newVisits);

                console.log('toAdd', elementsToAdd);
                console.log('toRemove', elementsToRemove);

                // Add new elements
                await this.addNewVisits(elementsToAdd);
                console.log('Added new items');
                // Remove elements
            } else {
                // Nothing changed - do nothing
                console.log('Nothing to add');
            }
        })
        .catch((error) => {
            console.log(error);
        });
    }

    async addNewVisits(elementsToAdd: firebase.firestore.DocumentReference[]) {
        for (const visitReference of elementsToAdd) {
            const visitObject = new VisitObject();
            await visitObject.setVisit(visitReference);
            this.renderedReferences.push(visitReference);
            this.user.visitsThree.push(visitObject);
        }
    }

    // Return differences between two DocumentReference arrays.
    private findDifferences(arrayOne: firebase.firestore.DocumentReference[], arrayTwo: firebase.firestore.DocumentReference[])  {
        return arrayOne.filter( (objectOne) => {
            return !arrayTwo.some( (objectTwo) => {
                return objectOne.isEqual(objectTwo);
            });
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
