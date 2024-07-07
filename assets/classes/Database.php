<?php

class Database
{
  private $pdo = null;

  public function __construct($dbhost, $dbname, $username, $password)
  {
    try {
      $this->pdo = new PDO("mysql:host={$dbhost};dbname={$dbname};", $username, $password);
      $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
      $this->pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch (PDOException $ex) {
      throw new PDOException($ex->getMessage());
    }
  }

  public function GetPDO()
  {
    return $this->pdo;
  }

  // Insert a row/s in a Database Table
  public function Insert($statement = "", $parameters = [])
  {
    try {
      $this->executeStatement($statement, $parameters);
      return $this->pdo->lastInsertId();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }

  // Select a row/s in a Database Table
  public function Select($statement = "", $parameters = [])
  {
    try {
      $stmt = $this->executeStatement($statement, $parameters);
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }

  // Update a row/s in a Database Table
  public function Update($statement = "", $parameters = [])
  {
    try {
      $this->executeStatement($statement, $parameters);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }

  // Remove a row/s in a Database Table
  public function Remove($statement = "", $parameters = [])
  {
    try {
      $this->executeStatement($statement, $parameters);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }

  public function convertDateFormat($date)
  {
    $dateTime = DateTime::createFromFormat('d/m/Y', $date);

    if ($dateTime === false) {
      return false;
    }

    return $dateTime->format('Y-m-d');
  }

  // execute statement
  private function executeStatement($statement = "", $parameters = [])
  {
    try {
      $stmt = $this->pdo->prepare($statement);
      $stmt->execute($parameters);
      return $stmt;
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }
}
