<?php

function insertIntoUnsubscribedSatisfactionEmail($email)
{
  global $db_host, $db_name, $db_user, $db_pass;
  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    $exists = $db->Select("SELECT email FROM unsubscribed_satisfaction_emails WHERE email = ?", [$email])[0]["email"] === $email;
    if (!$exists) {
      return $db->Insert("INSERT INTO unsubscribed_satisfaction_emails(email) VALUES(?)", [$email]);
    }
    return 1;
  } catch (PDOException $ex) {
    echo $ex->getMessage();
    exit();
  } finally {
    $db = null;
  }
}

function updateSentSatisfactionEmail($ids)
{
  global $db_host, $db_name, $db_user, $db_pass;
  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    $db->Update("UPDATE orders_clients SET sent_satisfaction_email = ? WHERE id_order_client = ?", [1, $ids]);
  } catch (PDOException $ex) {
    echo json_encode(["success" => false, "message" => $ex->getMessage()]);
    exit();
  } finally {
    $db = null;
  }
}

function getNoneSentSatisfactionEmailList()
{
  global $db_host, $db_name, $db_user, $db_pass;
  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    return $db->Select(
      "SELECT id_order_client, first_name, email 
       FROM orders_clients
       WHERE sent_satisfaction_email = ? AND appointment_date < CURDATE()",
      [0]
    );
  } catch (PDOException $ex) {
    echo json_encode(["success" => false, "message" => $ex->getMessage()]);
    exit();
  } finally {
    $db = null;
  }
}

function getUnsubscribedSatisfactionEmailList()
{
  global $db_host, $db_name, $db_user, $db_pass;

  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    return $db->Select("SELECT email FROM unsubscribed_satisfaction_emails");
  } catch (PDOException $ex) {
    echo json_encode(["success" => false, "message" => $ex->getMessage()]);
    exit();
  } finally {
    $db = null;
  }
}

function addOrderToDatabase($data)
{
  global $db_host, $db_name, $db_user, $db_pass;

  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    $db->GetPDO()->beginTransaction();
    $parameters = [
      $data['personal_last_name'],
      $data['personal_first_name'],
      strtolower($data['personal_email']),
      $data['personal_tel'],
      $data['personal_address'],
      $data['personal_city'],
      $data['washing_message'],
      $data['washing_car_size'],
      $db->convertDateFormat($data['appointment_date']),
      $data['appointment_hour'],
      date('Y-m-d H:i:s', $_SERVER['REQUEST_TIME'])
    ];
    $parameters = array_map('strtolower', $parameters);
    $ids = $db->InsertOrder($parameters);

    foreach ($data['washing_classic'] as $wash) {
      $parameters = [$ids["id"], $wash["name"], $wash["price"]];
      $db->InsertDetail("InsertWashDetail", $parameters);
    }

    foreach ($data['washing_options'] as $option) {
      $parameters = [$ids["id"], $option["name"], $option["price"]];
      $db->InsertDetail("InsertOptionDetail", $parameters);
    }

    foreach ($data['washing_finishing'] as $finishing) {
      $parameters = [$ids["id"], $finishing["name"], $finishing["price"]];
      $db->InsertDetail("InsertFinishingDetail", $parameters);
    }

    $db->GetPDO()->commit();
  } catch (PDOException $ex) {
    $db->GetPDO()->rollBack();
    $db = null;
    echo json_encode(["success" => false, "message" => $ex->getMessage()]);
    exit();
  } finally {
    $db = null;
  }
  return $ids;
}

function getFuturAppointmentDateAndHour()
{
  global $db_host, $db_name, $db_user, $db_pass;

  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    return $db->Select("SELECT appointment_date, appointment_hour FROM orders_clients WHERE appointment_date >= CURDATE()");
  } catch (PDOException $ex) {
    echo json_encode(["success" => false, "message" => $ex->getMessage()]);
    exit();
  } finally {
    $db = null;
  }
}

function getAdministratorPassword($email)
{
  global $db_host, $db_name, $db_user, $db_pass;

  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    return $db->Select("SELECT password FROM administrators WHERE email = ?", [$email]);
  } catch (PDOException $ex) {
    echo json_encode(["success" => false, "message" => $ex->getMessage()]);
    exit();
  } finally {
    $db = null;
  }
}
