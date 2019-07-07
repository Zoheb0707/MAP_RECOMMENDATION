<?php

    /**
        Author: Zoheb0707
        Created: 06/21/2019

        This is the restaurants.php file. It returns informationabout all restaurants
        or a specific restaurant if it exists in the database.
    */

    include "database_object.php";
    include "common.php";

    if (isset($_GET["mode"])) {
        $mode = strtolower($_GET["mode"]);
        if($mode === "all") {
            get_all();
        }
        else if ($mode === "one") {
            if(isset($_GET["restaurant"])) {
                $restaurant = strtolower($_GET["restaurant"]);
                if (contains_restaurant($restaurant)) {
                    get_one($restaurant);
                }
                else {
                    header("HTTP/1.1 400 Invalid Request");
                    header("Content-type: text/plain");
                    print("{$_GET["restaurant"]} is not a restaurant");
                }
            }
            else {
                header("HTTP/1.1 400 Invalid Request");
                header("Content-type: text/plain");
                print("restaurant parameter is missing");
            }
        }
        else {
            header("HTTP/1.1 400 Invalid Request");
            header("Content-type: text/plain");
            print("mode takes values all or one");
        }
    }
    else {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-type: text/plain");
        print("Enter parameter for mode. mode param takes \"all\" or <restaurant id> as input.");
    }

    function get_all() {
        try {
            $query = "SELECT * FROM restaurants;";
            $db = get_PDO();
            $output = $db->query($query);
            $output = $output->fetchALL(PDO::FETCH_ASSOC);
            header("Content-type: application/json");
            print(json_encode($output));
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
    }

    function get_one($mode) {
        try {
            $db = get_PDO();
            $query = "SELECT * FROM restaurants WHERE restaurant_id = :id;";
            $statement = $db->prepare($query);
            $params = array("id" => $mode);
            $statement->execute($params);
            $output = $statement->fetch(PDO::FETCH_ASSOC);
            header("Content-type: application/json");
            print(json_encode($output));
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
    }
?>
