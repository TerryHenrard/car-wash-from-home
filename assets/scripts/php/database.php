<?php

function insertIntoUnsubscribedSatisfactionEmail($email)
{
  global $db_host, $db_name, $db_user, $db_pass;
  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    return $db->Insert("INSERT INTO unsubscribed_satisfaction_email(email) VALUES(?)", [$email]);
  } catch (PDOException $ex) {
    echo $ex->getMessage();
    exit();
  } finally {
    $db = null;
  }
}

function updateSentSatisfactionEmail($order_id)
{
  global $db_host, $db_name, $db_user, $db_pass;
  try {
    $db = new Database($db_host, $db_name, $db_user, $db_pass);
    $db->Update("UPDATE order_client SET sent_satisfaction_email = ? WHERE id_order_client = ?", [1, $order_id]);
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
    return $db->Select("SELECT id_order_client, first_name, email FROM order_client WHERE sent_satisfaction_email = ?", [0]);
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
    return $db->Select("SELECT email FROM unsubscribed_satisfaction_email");
  } catch (PDOException $ex) {
    echo json_encode(["success" => false, "message" => $ex->getMessage()]);
    exit();
  } finally {
    $db = null;
  }
}

function addOrderToDatabase($data)
{
  global $db_host, $db_name, $db_user, $db_pass, $order_id;

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
    $order_id = $db->InsertOrder($parameters);

    foreach ($data['washing_classic'] as $wash) {
      $parameters = [$order_id, $wash["name"]];
      $db->InsertDetail("InsertWashDetail", $parameters);
    }

    foreach ($data['washing_options'] as $option) {
      $parameters = [$order_id, $option["name"]];
      $db->InsertDetail("InsertOptionDetail", $parameters);
    }

    foreach ($data['washing_finishing'] as $finishing) {
      $parameters = [$order_id, $finishing["name"]];
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
  return $order_id;
}
