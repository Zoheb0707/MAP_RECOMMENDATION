<?php
    /**
        Author: Zoheb0707
        Created: 06/23/2019

        This is the update_user.php file. It is used to update the users database
        with a new user or update the password of an existing user.
    */

    #change get to post.

    include "database_object.php";
    include "common.php";

    if (isset($_POST["mode"])) {
        $mode = strtolower($_POST["mode"]);
        if ($mode === "new") {
            if (isset($_POST["user"]) & isset($_POST["passwd"]) &
            isset($_POST["first_name"]) & isset($_POST["last_name"])) {
                $user = strtolower($_POST["user"]);
                if (!(contains_user($user))) {
                    $passwd = $_POST["passwd"];
                    $first_name = $_POST["first_name"];
                    $last_name = $_POST["last_name"];
                    add_new_user($user, $passwd, $first_name, $last_name);
                }
                else {
                    header("HTTP/1.1 400 Invalid Request");
                    header("Content-type: text/plain");
                    print("{$_POST["user"]} already present.");
                }
            }
            else {
                header("HTTP/1.1 400 Invalid Request");
                header("Content-type: text/plain");
                print("Enter params user, passwd, first_name and last_name");
            }
        }
        else if ($mode === "update") {
            if (isset($_POST["passwd"]) & isset($_POST["user"])) {
                $user = strtolower($_POST["user"]);
                $passwd = $_POST["passwd"];
                if (contains_user($user)) {
                    update_passwd($user, $passwd);
                }
                else {
                    header("HTTP/1.1 400 Invalid Request");
                    header("Content-type: text/plain");
                    print("{$_POST["user"]} not found.");
                }
            }
            else {
                header("HTTP/1.1 400 Invalid Request");
                header("Content-type: text/plain");
                print("Enter params user and passwd");
            }
        }
        else {
            header("HTTP/1.1 400 Invalid Request");
            header("Content-type: text/plain");
            print("mode takes \"new\" or \"update\" as parameters.");
        }
    }
    else {
        header("HTTP/1.1 400 Invalid Request");
        header("Content-type: text/plain");
        print("Enter parameter for mode. It takes \"new\" or \"update\" as parameters.");
    }

    function update_passwd($user, $passwd) {
        $query = "UPDATE users SET password = :passwd WHERE " .
                 "user_id = :user;";
        try {
            $db = get_PDO();
            $statement = $db->prepare($query);
            $params = array("passwd" => $passwd, "user" => $user);
            $statement->execute($params);
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
    }

    function add_new_user($user, $passwd, $first_name, $last_name) {
        $query = "INSERT INTO users VALUES (:user, :passwd, :first_name, :lastname);";
        try {
            $db = get_PDO();
            $statement = $db->prepare($query);
            $params = array("passwd" => $passwd, "user" => $user,
                            "first_name" => $first_name, "lastname" => $last_name);
            $statement->execute($params);
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
    }
?>
