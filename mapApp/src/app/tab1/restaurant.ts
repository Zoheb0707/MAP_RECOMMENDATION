export class Restaurant {
    restaurant_id: string;
    times: string;
    avg_rating: string;

    constructor(restaurant) {
        this.restaurant_id = restaurant.restaurant_id;
        this.times = restaurant.times;
        this.avg_rating = restaurant.avg_rating;
    }

    compare(toCompare: Restaurant) {
        return this.restaurant_id === toCompare.restaurant_id && this.times === toCompare.times && this.avg_rating === toCompare.avg_rating;
    }
}
