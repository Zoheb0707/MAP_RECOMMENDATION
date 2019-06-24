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
        else if (contains_restaurant($mode)) {
            try {
                $db = get_PDO();
                $query = "SELECT * FROM restaurants WHERE restaurant_id = :id;";
                $statement = $db->prepare($query);
                $params = array("id" => $mode);
                $statement->execute($params);
                $output = $statement->fetchALL(PDO::FETCH_ASSOC);
                header("Content-type: application/json");
                print(json_encode($output));
            }
            catch (PDOException $ex) {
                handleDatabaseError();
            }
        }
        else {
            header("HTTP/1.1 400 Invalid Request");
            header("Content-type: text/plain");
            print("{$_GET["mode"]} not in restaurants table.\n");
            print("mode parameter also takes value \"all\".");
        }
    }
    else {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-type: text/plain");
        print("Enter parameter for mode. mode param takes \"all\" or <restaurant id> as input.");
    }
?>
