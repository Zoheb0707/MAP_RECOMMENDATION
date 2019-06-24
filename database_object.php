<?php

    /**
        Author: Zoheb0707
        Created: 06/20/2019

        This is the database_object.php file. It includes a function that returns the
        db connection and another responsible for throwing db connection errors.
    */

    /**
        This function returns a PDO object if it connects to the database.
        Else a 503 exception is thrown.
    */
    function get_PDO() {
      # Variables for connections to the database.
      $host = "localhost";     # fill in with server name (e.g. localhost)
      $port = "3306";      # fill in with a port if necessary (will be different mac/pc)
      $user = "root";     # fill in with user name
      $password = "root"; # fill in with password (will be different mac/pc)
      $dbname = "maps";   # fill in with db name containing your SQL tables

      # Make a data source string that will be used in creating the PDO object
      $ds = "mysql:host={$host}:{$port};dbname={$dbname};charset=utf8";

      try {
        $db = new PDO($ds, $user, $password);
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        return $db;
      } catch (PDOException $ex) {
        handleDatabaseError();
      }
    }

    function handleDatabaseError() {
      header("HTTP/1.1 503 Service Unavailable");
      header("Content-Type: application/json");
      print(json_encode(["error" => "A database error occurred. Please try again later."]));
    }

?>
