/**
    Author: Zoheb0707
    Created: 06/20/2019
*/

/*
    Use this file to populate the empty tables with dummy data for server code testing.
*/

USE maps;

INSERT INTO users
    VALUES ("test_user_1", "test_password_1", "test_fn_1", "test_ln_1"),
    ("test_user_2", "test_password_2", "test_fn_2", "test_ln_2"),
    ("test_user_3", "test_password_3", "test_fn_3", "test_ln_3");

INSERT INTO restaurants
    VALUES ("test_restaurant_1", "test_name_1", "test_type_1", "test_location_1"),
    ("test_restaurant_2", "test_name_2", "test_type_2", "test_location_2");

INSERT INTO visits
    VALUES ("test_restaurant_1", "test_user_1", 3, 4.5),
    ("test_restaurant_1", "test_user_3", 1, 4.0),
    ("test_restaurant_2", "test_user_3", 2, 3.6);
