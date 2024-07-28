<?php
require "../../../../assets/classes/Database.php";
require "../../../../../config.php";

function getTurnover()
{
  global $db_host, $db_name, $db_user, $db_pass;

  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    $query = "SELECT 
      (SELECT SUM(CAST(price * (1 - reduction) AS DECIMAL(10, 2))) FROM washes_details) +
      (SELECT SUM(CAST(price * (1 - reduction) AS DECIMAL(10, 2))) FROM options_details) +
      (SELECT SUM(CAST(price * (1 - reduction) AS DECIMAL(10, 2))) FROM finishings_details) + 
      (SELECT SUM(tip) FROM orders_clients) AS total_revenue
    ";
    $turnover = $db->Select($query)[0]["total_revenue"];
    return $turnover;
  } catch (PDOException $ex) {
    throw $ex;
  }
}

function getCurrTurnover()
{
  global $db_host, $db_name, $db_user, $db_pass;

  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    $query = "SELECT 
	  (SELECT SUM(wd.price)
     FROM washes_details wd
     INNER JOIN orders_clients oc ON oc.id_order_client = wd.id_order_client
     WHERE YEAR(oc.appointment_date) = YEAR(CURDATE())) + 
    (SELECT SUM(od.price)
     FROM options_details od
     INNER JOIN orders_clients oc ON oc.id_order_client = od.id_order_client
     WHERE YEAR(oc.appointment_date) = YEAR(CURDATE())) + 
    (SELECT SUM(fd.price)
     FROM finishings_details fd
     INNER JOIN orders_clients oc ON oc.id_order_client = fd.id_order_client
     WHERE YEAR(oc.appointment_date) = YEAR(CURDATE())) + 
    (SELECT SUM(tip) FROM orders_clients 
     WHERE YEAR(appointment_date) = YEAR(CURDATE())) AS total_revenue_curr_year
    ";
    $turnover = $db->Select($query)[0]["total_revenue_curr_year"];
    return $turnover;
  } catch (PDOException $ex) {
    throw $ex;
  }
}
