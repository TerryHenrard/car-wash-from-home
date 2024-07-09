<?php
require '../../classes/Database.php';
require './database.php';
require './email.php';
// require '../../../../config.php'; // Production environment
require '../../../../../config.php'; // Development environment

$noneSentSatisfactionEmailList = getNoneSentSatisfactionEmailList();
$unsubscribedList = getUnsubscribedSatisfactionEmailList();
$unsubscribedList = array_map('array_shift', $unsubscribedList);

foreach ($noneSentSatisfactionEmailList as $list) {
  if (!in_array($list["email"], $unsubscribedList)) {
    $response = sendClientSatisfactionEmail($list["first_name"], $list["email"]);

    if (!$response["success"]) {
      exit();
    }
  }
  updateSentSatisfactionEmail($list["id_order_client"]);
}
