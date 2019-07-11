<?php
  
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT");
    header("Access-Control-Allow-Headers': Origin, Content-Type, application/json");

    /**
        Author: Zoheb0707
        Created: 07/04/2019

        This is the authenticate.php file. It
    */

    include "common.php";
    include "database_object.php";


    if (isset($_POST["user_id"]) && isset($_POST["password"])) {
        $user = strtolower($_POST["user_id"]);
        $passwd = $_POST["password"];
        if(contains_user($user)) {
            check_password($user, $passwd);
        }
        else {
            header("HTTP/1.1 404 Not Found");
            header("Content-type: text/plain");
            print("User not found!");
        }
    }
    else {
        header("HTTP/1.1 400 Bad Request");
        header("Content-type: text/plain");
        print("Enter user and passwd parameters");
    }

    function check_password($user, $passwd) {
        $user_info = get_user($user);
        $true_passwd = $user_info["password"];
        if ($true_passwd === $passwd) {
	    $expiresIn = 24 * 60 * 60;
            $response->user = $user_info;
	    $response->expires_in = $expiresIn;		
	    header("HTTP/1.1 200 OK");
            header('Content-type: application/json');
            echo json_encode($response); 
        }
        else {
            header("HTTP/1.1 401 Unauthorized");
            header("Content-type: text/plain");
            print("Password not valid!");
        }

    }

?>
