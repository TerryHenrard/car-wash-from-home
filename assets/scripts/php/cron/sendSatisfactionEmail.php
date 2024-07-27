<?php
function isDevelopmentEnvironment()
{
  return preg_match('/develop/', __DIR__);
}

if (isDevelopmentEnvironment()) {
  require __DIR__ . '/../../../../../../config.php'; // Development environment
} else {
  require __DIR__ . '/../../../../../config.php'; // Production environment
}

require __DIR__ . '/../../../classes/Database.php';
require __DIR__ . '/../database.php';
require __DIR__ . '/../email.php';

$noneSentSatisfactionEmailList = getNoneSentSatisfactionEmailList();
$unsubscribedList = getUnsubscribedSatisfactionEmailList();
$unsubscribedList = array_map('array_shift', $unsubscribedList);

foreach ($noneSentSatisfactionEmailList as $list) {
  if (!in_array($list["email"], $unsubscribedList)) {
    $response = sendClientSatisfactionEmail($list["first_name"], $list["email"]);

    if (!$response["success"]) {
      echo "failed:" . $response["message"];
      exit();
    }
  }
  updateSentSatisfactionEmail($list["id_order_client"]);
}

echo "success";
