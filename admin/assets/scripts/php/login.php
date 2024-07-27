<?php
header('Content-Type: application/json');
$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] !== "POST" || !isset($data["password"], $data["email"])) {
  exit();
}

require "../../../../../config.php";
require "../../../../assets/classes/Database.php";
require "../../../../assets/scripts/php/database.php";

function checkPassword($source, $target)
{
  return hash("sha3-512", $source) === $target;
}

try {
  $password = getAdministratorPassword($data["email"]);

  if (checkPassword($data["password"], $password)) {
    echo json_encode(["success" => true, "message" => $ex->getMessage()]);
  } else {
    echo json_encode(["success" => false, "message" => "incorrect password"]);
  }
} catch (PDOException $ex) {
  echo json_encode(["success" => false, "message" => $ex->getMessage()]);
}
