<?php

    /**
        Author: Zoheb0707
        Created: 06/21/2019

        This is the get_users.php file. It returns information about all users, or
        about a specific user if the user exists in the database.
    */

    include "database_object.php";
    include "common.php";

    if (isset($_GET["mode"])) {
        $mode = strtolower($_GET["mode"]);
        if($mode === "all") {
            try {
                $query = "SELECT * FROM users;";
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
        else if (contains_user($mode)) {
            try {
                $db = get_PDO();
                $query = "SELECT * FROM users WHERE user_id = :id;";
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
            print("{$_GET["mode"]} not in users table.\n");
            print("mode parameter also takes value \"all\".");
        }
    }
    else {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-type: text/plain");
        print("Enter parameter for mode. mode param takes \"all\" or <user id> as input.");
    }

?>
