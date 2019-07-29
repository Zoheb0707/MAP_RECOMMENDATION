export interface User {
    email: string;
    name: {
        first: string;
        last: string;
    };
    password: string;
    city: string;
    preferences: string[];
}
