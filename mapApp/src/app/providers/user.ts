import { Visit } from './visit';

export interface User {
    uid: string;
    name: {
        first: string;
        last: string;
    };
    city: string;
    preferences: string[];
    visitsTwo: firebase.firestore.DocumentSnapshot;
    visits: firebase.firestore.DocumentData[];
}
