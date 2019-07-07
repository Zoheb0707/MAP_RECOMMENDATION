<?php

    /**
        Author: Zoheb0707
        Created: 06/22/2019

        This is the common.php file. It contains code that is used across multiple
        .php files.
    */

    function contains_user($mode) {
        $name_in_table = False;
        try {
            $db = get_PDO();
            $query = "SELECT * FROM users WHERE user_id = :id;";
            $statement = $db->prepare($query);
            $params = array("id" => $mode);
            $statement->execute($params);
            $output = $statement->fetchALL(PDO::FETCH_ASSOC);
            if (sizeof($output) !== 0) {
                $name_in_table = True;
            }
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
        return $name_in_table;
    }

    function contains_restaurant($mode) {
        $name_in_table = False;
        try {
            $db = get_PDO();
            $query = "SELECT * FROM restaurants WHERE restaurant_id = :id;";
            $statement = $db->prepare($query);
            $params = array("id" => $mode);
            $statement->execute($params);
            $output = $statement->fetchALL(PDO::FETCH_ASSOC);
            if (sizeof($output) !== 0) {
                $name_in_table = True;
            }
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
        return $name_in_table;
    }

    function get_user($mode) {
        try {
            $db = get_PDO();
            $query = "SELECT * FROM users WHERE user_id = :id;";
            $statement = $db->prepare($query);
            $params = array("id" => $mode);
            $statement->execute($params);
            $output = $statement->fetch(PDO::FETCH_ASSOC);
            return($output);
        }
        catch (PDOException $ex) {
            handleDatabaseError();
        }
    }

?>
