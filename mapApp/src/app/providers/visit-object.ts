import * as firebase from 'firebase';
import { Visit } from './visit-interface';

export class VisitObject implements Visit {

    uid: string;
    name: string;
    pid: string;
    date: firebase.firestore.Timestamp;
    rating: number;

    id: string;

    private document: firebase.firestore.DocumentData;

    constructor() {
        this.uid = '';
        this.name =  '';
        this.pid = '';
        this.date = undefined;
        this.rating = NaN;

        this.id = '';
        this.document = undefined;
    }

    async setVisit(visit: firebase.firestore.DocumentReference) {
        await visit.get()
        .then( async (response) => {
            this.document = await response.data();
            this.uid = this.document.uid;
            this.name = this.document.name;
            this.pid = this.document.pid;
            this.date = this.document.date;
            this.rating = this.document.rating;
            this.id = response.id;
        })
        .catch( (error) => {
            console.log(error);
        });
    }

    getVisit() {
        return this;
    }

}
