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

  public function InsertOrder($parameters = [])
  {
    try {
      $this->executeStatement("CALL InsertOrder(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @inserted_id)", $parameters);
      $id = $this->executeStatement("SELECT @inserted_id AS id")->fetch()['id'];
      $uid = $this->generateUid($id);
      $this->executeStatement("UPDATE orders_clients SET uid_order_client = ? WHERE id_order_client = ?", [$uid, $id]);
      return ["id" => $id, "uid" => $uid];
    } catch (PDOException $ex) {
      throw new PDOException($ex->getMessage());
    }
  }

  public function InsertDetail($procedure = "", $parameters = [])
  {
    try {
      return $this->executeStatement("CALL $procedure(?, ?, ?)", $parameters);
    } catch (PDOException $ex) {
      throw new PDOException($ex->getMessage());
    }
  }

  public function Insert($statement = "", $parameters = [])
  {
    try {
      $this->executeStatement($statement, $parameters);
      return $this->pdo->lastInsertId();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }

  public function Select($statement = "", $parameters = [])
  {
    try {
      $stmt = $this->executeStatement($statement, $parameters);
      return $stmt->fetchAll();
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }

  public function Update($statement = "", $parameters = [])
  {
    try {
      $this->executeStatement($statement, $parameters);
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }

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

  private function executeStatement($statement = "", $parameters = [])
  {
    try {
      $stm = $this->pdo->prepare($statement);
      $stm->execute($parameters);
      return $stm;
    } catch (PDOException $e) {
      throw new PDOException($e->getMessage());
    }
  }

  private function generateUid($order_id)
  {
    return strtoupper(substr(hash('sha512', $order_id . time()), 0, 8));
  }
}
