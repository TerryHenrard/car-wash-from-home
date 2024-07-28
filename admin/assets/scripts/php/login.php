<?php
session_start();
if (
  $_SERVER["REQUEST_METHOD"] !== "POST" ||
  !isset($_POST["password"], $_POST["email"], $_POST["admin_token"], $_SESSION["admin_token"]) ||
  $_SESSION["admin_token"] != $_POST["admin_token"]
) {
  exit();
}

require "../../../../../config.php";
require "../../../../assets/classes/Database.php";
require "../../../../assets/scripts/php/database.php";

function checkPassword($source, $target)
{
  return hash("sha3-512", $source) === $target;
}
echo "test3";
$password = getAdministratorPassword($_POST["email"])[0]["password"];

if (checkPassword($_POST["password"], $password)) {
  echo "test1";
  header("Location: ../../../pages/dashboard.php?admin_token=" . urlencode($_POST["admin_token"]));
  exit();
}
echo "test2";
header("Location: ../../../../index.php");
