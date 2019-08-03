import { VisitObject } from './visit-object';

export interface User {
    uid: string;
    name: {
        first: string;
        last: string;
    };
    city: string;
    preferences: string[];
    visits: VisitObject[];
}
