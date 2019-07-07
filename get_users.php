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
            get_all();
        }
        else if ($mode === "one") {
            if (isset($_GET["user"])) {
                $user = strtolower($_GET["user"]);
                if (contains_user($user)) {
                    header("Content-type: application/json");
                    print(json_encode(get_user($user)));
                }
                else {
                    header("HTTP/1.1 400 Invalid Request");
                    header("Content-type: text/plain");
                    print("{$_GET["user"]} is not a user");
                }
            }
            else {
                header("HTTP/1.1 400 Invalid Request");
                header("Content-type: text/plain");
                print("enter value for user parameter");
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
        print("Enter parameter for mode. mode param takes \"all\" or <user id> as input.");
    }

    function get_all() {
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


?>
