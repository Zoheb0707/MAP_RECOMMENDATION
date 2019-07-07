<?php
    /**
        Author: Zoheb0707
        Created: 07/04/2019

        This is the authenticate.php file. It
    */

    include "common.php";
    include "database_object.php";


    if (isset($_GET["user"]) && isset($_GET["passwd"])) {
        $user = strtolower($_GET["user"]);
        $passwd = $_GET["passwd"];
        if(contains_user($user)) {
            check_password($user, $passwd);
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
        print("Enter user and passwd parameters");
    }

    function check_password($user, $passwd) {
        $user_info = get_user($user);
        $true_passwd = $user_info["password"];
        if ($true_passwd === $passwd) {
            header("Content-type: text/plain");
            print("True");
        }
        else {
            header("Content-type: text/plain");
            print("False");
        }

    }

?>
