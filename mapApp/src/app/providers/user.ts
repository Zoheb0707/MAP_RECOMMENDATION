import { VisitObject } from './visit-object';

export interface User {
    uid: string;
    name: {
        first: string;
        last: string;
    };
    city: string;
    preferences: string[];
    // Remove this!
    visitsTwo: firebase.firestore.DocumentSnapshot;
    // Remove this!
    visits: firebase.firestore.DocumentData[];
    // Should be the only thing left!
    visitsThree: VisitObject[];
}
