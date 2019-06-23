<?php

    /**
        Author: Zoheb0707
        Created: 06/22/2019

        This is the get_visits.php file. It returns informationabout all restaurants
        or a specific restaurant if it exists in the database.
    */

    include "database_object.php";
    include "common.php";

    if (isset($_GET["mode"])) {
        $mode = strtolower($_GET["mode"]);
        if ($mode === "all") {
            get_all_visits($mode);
        }
        else if (contains_user($mode)) {
            get_all_user_visits($mode);
        }
        else if (contains_restaurant($mode)) {
            get_all_restaurant_visits($mode);
        }
        else {
            header("HTTP/1.1 400 Invalid Request");
            header("Content-type: text/plain");
            print("The mode parameter either takes value \"all\" or ");
            print("<user id> or <restaurant id>");
        }
    }
    else if (isset($_GET["user"]) && isset($_GET["restaurant"])) {
        $user = strtolower($_GET["user"]);
        $restaurant = strtolower($_GET["restaurant"]);
        if (contains_user($user) && contains_restaurant($restaurant)) {
            get_user_restaurant_pair($user, $restaurant);
        }
        else {
            header("HTTP/1.1 400 Invalid Request");
            header("Content-type: text/plain");
            print("The user and/or restaurant parmeters specified are not valid.");
        }
    }
    else {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-type: text/plain");
        print("Either enter mode parameter or both user and restaurant parameters.");
        print("\nThe mode parameter takes values \"all\", <user id> or <restaurant id>.");
        print("\nThe user parameter takes user id and restaurant" .
                " parameter takes restaurant id");
    }

    function get_all_visits($mode) {
        try {
            $query = "SELECT * FROM visits;";
            $db = get_PDO();
            $result = $db->query($query);
            $result = $result->fetchALL(PDO::FETCH_ASSOC);
            header("Content-type: application/json");
            print(json_encode($result));
        } catch (PDOException $ex) {
            handleDatabaseError();
        }
    }

    function get_all_user_visits($mode) {
        try {
            $query = "SELECT * FROM visits WHERE user_id = :user;";
            $db = get_PDO();
            $statement = $db->prepare($query);
            $params = array("user" => $mode);
            $statement->execute($params);
            $result = $statement->fetchALL(PDO::FETCH_ASSOC);
            header("Content-type: application/json");
            print(json_encode($result));
        } catch (PDOException $ex) {
            handleDatabaseError();
        }
    }

    function get_all_restaurant_visits($mode) {
        try {
            $query = "SELECT * FROM visits WHERE restaurant_id = :restaurant;";
            $db = get_PDO();
            $statement = $db->prepare($query);
            $params = array("restaurant" => $mode);
            $statement->execute($params);
            $result = $statement->fetchALL(PDO::FETCH_ASSOC);
            header("Content-type: application/json");
            print(json_encode($result));
        } catch (PDOException $ex) {
            handleDatabaseError();
        }
    }

    function get_user_restaurant_pair($user, $restaurant) {
        try {
            $query = "SELECT * FROM visits WHERE restaurant_id = :restaurant" .
                     " and user_id = :user;";
            $db = get_PDO();
            $statement = $db->prepare($query);
            $params = array("restaurant" => $restaurant, "user" => $user);
            $statement->execute($params);
            $result = $statement->fetchALL(PDO::FETCH_ASSOC);
            header("Content-type: application/json");
            print(json_encode($result));
        } catch (PDOException $ex) {
            handleDatabaseError();
        }
    }


?>
