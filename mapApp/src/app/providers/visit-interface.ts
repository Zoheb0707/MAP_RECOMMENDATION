export interface Visit {
    uid: string;
    name: string;
    pid: string;
    date: firebase.firestore.Timestamp;
    rating: number;
}
