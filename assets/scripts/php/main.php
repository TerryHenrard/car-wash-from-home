<?php
session_start();
header('Content-Type: application/json');

// Check csrf token validity and method = POST
if (!isset($_POST, $_SESSION['csrf_token']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
  exit();
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
if ($data["csrf_token"] !== $_SESSION['csrf_token']) {
  exit();
}

function isDevelopmentEnvironment()
{
  return preg_match('/develop/', __DIR__);
}

if (isDevelopmentEnvironment()) {
  require '../../../../../config.php'; // Development environment
} else {
  require '../../../../config.php'; // Production environment
}

require './validation.php';
require './database.php';
require './email.php';
require './format.php';
require '../../classes/Database.php';

$sanitizedData = sanitizeAppointmentData($data);

if (!validateAppointmentData($sanitizedData)) {
  echo json_encode(["success" => false, "message" => "Invalid input data"]);
  exit();
}

// Here data are secure
date_default_timezone_set('Europe/Brussels');

// Add into database
$ids = addOrderToDatabase($sanitizedData);

if ($ids["id"] > 0) {
  // Send email to client
  $clientEmailResponse = sendClientConfirmationEmail($sanitizedData, $ids["uid"]);

  if ($clientEmailResponse["success"]) {
    // Send email to administrator
    $adminEmailResponse = sendAdminNotificationEmail($sanitizedData, $ids["uid"]);

    echo json_encode([
      "success" => $adminEmailResponse['success'],
      "clientResponse" => $clientEmailResponse['message'],
      "adminResponse" => $adminEmailResponse['message'],
      "databaseResponse" => "Added successfully",
    ]);
  }
}
