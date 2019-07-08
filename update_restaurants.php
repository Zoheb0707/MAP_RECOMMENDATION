<?php
    /**
        Author: Zoheb0707
        Created: 07/04/2019

        This file alters information about an existing restaurant
        or adds a new restuarant to the restaurants table;
    */

    include "common.php";
    include "database_object.php";

    if (isset($_POST["mode"])) {
        $mode = strtolower($_POST["mode"]);
        if ($mode === "new") {
            if (isset($_POST["restaurant"]) && isset($_POST["name"])
                && isset($_POST["type"]) && isset($_POST["location"])) {
                    $restaurant = strtolower($_POST["restaurant"]);
                    $name = $_POST["name"];
                    $type = $_POST["type"];
                    $location = $_POST["location"];
                    if (contains_restaurant($restaurant)) {
                        header("HTTP/1.1 400 Invalid Request");
                        header("Content-type: text/plain");
                        print("{$_POST["restaurant"]} already exists");
                    }
                    else {
                        add_new_restaurant($restaurant, $name, $type, $location);
                    }
                }
                else {
                    header("HTTP/1.1 400 Invalid Request");
                    header("Content-type: text/plain");
                    print("enter params restaurant, name, type and location.");
                }
        }
        else if($mode == "update") {
            if (isset($_POST["restaurant"])) {
                $restaurant = strtolower($_POST["restaurant"]);
                if (contains_restaurant($restaurant)) {
                    $updated = False;
                    if (isset($_POST["name"])) {
                        $updated = True;
                        $name = $_POST["name"];
                        update_restaurant($restaurant, "name", $name);
                    }
                    if (isset($_POST["type"])) {
                        $updated = True;
                        $type = $_POST["type"];
                        update_restaurant($restaurant, "name", $type);
                    }
                    if (isset($_POST["location"])) {
                        $updated = True;
                        $location = $_POST["location"];
                        update_restaurant($restaurant, "name", $location);
                    }
                    if (!($updated)) {
                        header("HTTP/1.1 400 Invalid Request");
                        header("Content-type: text/plain");
                        print("enter a parameter to update.\n");
                        print("valid params: name, type, location.");
                    }
                }
                else {
                    header("HTTP/1.1 400 Invalid Request");
                    header("Content-type: text/plain");
                    print("{$_POST["restaurant"]} is not a restaurant");
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
            print("mode takes values new or update");
        }
    }
    else {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-type: text/plain");
        print("mode parameter is missing.");
    }

    function add_new_restaurant($restaurant, $name, $type, $location) {
        try {
            $query = "INSERT INTO restaurants VALUES " .
                        "(:restaurant, :name, :type, :location);";
            $db = POST_PDO();
            $statement = $db->prepare($query);
            $params = array("restaurant" => $restaurant, "name" => $name,
                            "type" => $type, "location" => $location);
            $statement->execute($params);
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
    }

    function update_restaurant($restaurant, $column, $value) {
        $query = "UPDATE restaurants SET {$column} = :value " .
                    "WHERE restaurant_id = :restaurant;";
        try {
            $db = POST_PDO();
            $statement = $db->prepare($query);
            $params = array("value" => $value, "restaurant" => $restaurant);
            $statement->execute($params);
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
    }
?>
