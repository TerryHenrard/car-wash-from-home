<?php
session_start();
//check csrf_token validity and method = POST
if (!isset($_POST, $_SESSION['csrf_token']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
  exit();
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);
if ($data["csrf_token"] !== $_SESSION['csrf_token']) {
  exit();
}

// require '../../../../config.php';
require '../../../../../config.php'; // Modify when switching to the development environment
require 'validation.php';
require 'data.php';
require 'email.php';
require '../../classes/Database.php';

// Get and sanitize data
$appointmentDate = preventScriptTag($data['appointmentInfos']['date'] ?? null);
$appointmentHour = preventScriptTag($data['appointmentInfos']['hour'] ?? null);
$personalAddress = preventScriptTag($data['personnalInfos']['address'] ?? null);
$personalCity = preventScriptTag($data['personnalInfos']['city'] ?? null);
$personalEmail = preventScriptTag($data['personnalInfos']['email'] ?? null);
$personalFirstName = preventScriptTag($data['personnalInfos']['firstName'] ?? null);
$personalLastName = preventScriptTag($data['personnalInfos']['lastName'] ?? null);
$personalTel = preventScriptTag($data['personnalInfos']['tel'] ?? null);
$washingCarSize = preventScriptTag($data['washingInfos']['carSize'] ?? null);
$washingClassic = $data['washingInfos']['classic'] ?? [];
$washingFinishing = $data['washingInfos']['finishing'] ?? [];
$washingMessage = preventScriptTag($data['washingInfos']['message'] ?? null);
$washingOptions = $data['washingInfos']['options'] ?? [];
$washingPrice = (int)($data['washingInfos']['price'] ?? 0);
$washingTime = (int)($data['washingInfos']['time'] ?? 0);

if (
  !validateDate($appointmentDate) ||
  !validateTime($appointmentHour) ||
  !validateWithRegex($personalAddress, $regexs["address"]) ||
  !validateWithRegex($personalCity, $regexs["city"]) ||
  !validateWithRegex($personalEmail, $regexs["email"]) ||
  !validateWithRegex($personalFirstName, $regexs["firstName"]) ||
  !validateWithRegex($personalLastName, $regexs["lastName"]) ||
  !validateWithRegex($personalTel, $regexs["tel"]) ||
  !validateItems($washingClassic, $validClassicWashes) ||
  !validateItems($washingFinishing, $validFinishing) ||
  !validateWithRegex($washingMessage, $regexs["message"]) ||
  !validateItems($washingOptions, $validOptions) ||
  !validateInt($washingPrice) ||
  !validateInt($washingTime)
) {
  echo json_encode(["success" => false, "message" => "Invalid input data"]);
  exit();
}

// Here data are secure
date_default_timezone_set('Europe/Brussels');

// Add into database
$order_id;
try {
  $db = new Database($db_host, $db_name, $db_user, $db_pass);

  $db->GetPDO()->beginTransaction();

  $statement = "INSERT INTO 
                  order_client(
                    last_name, 
                    first_name, 
                    email, 
                    phone_number, 
                    address, 
                    city, 
                    message, 
                    appointment_date, 
                    appointment_hour, 
                    order_date) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

  $parameters = [
    $personalLastName,
    $personalFirstName,
    $personalEmail,
    $personalTel,
    $personalAddress,
    $personalCity,
    $washingMessage,
    $db->convertDateFormat($appointmentDate),
    $appointmentHour,
    date('Y-m-d H:i:s', $_SERVER['REQUEST_TIME'])
  ];

  $order_id = $db->Insert($statement, $parameters);

  $db->GetPDO()->commit();
} catch (PDOException $ex) {
  $db->GetPDO()->rollBack();
  $db = null;
  echo json_encode(["success" => false, "message" => $ex->getMessage()]);
  exit();
}

if ($order_id > 0) {
  $subject = 'Confirmation du rendez-vous du ' . $appointmentDate . ' à ' . $personalAddress . ' ' . $personalCity;
  $replyto = ['email' => 'contact@carwashfromhome.com', 'name' => 'Car Wash From Home'];
  $variables = [
    "logo_cwfh_path" => "../images/logo4.webp",
    "client_firstName" => ucfirst($personalFirstName),
    "appointment_date" => $appointmentDate,
    "appointment_hour" => $appointmentHour,
    "client_address" => $personalAddress . ', ' . ucfirst($personalCity),
    "order_details" =>
    buildOrderDetails($washingClassic, $orderDetailTemplatePath, $classicImagePath) .
      buildOrderDetails($washingOptions, $orderDetailTemplatePath, $optionImagePaths) .
      buildOrderDetails($washingFinishing, $orderDetailTemplatePath, $finishingImagePaths),
    "order_total" => $washingPrice . '€',
    "order_time" => formatTime($washingTime),
    "order_id" => $order_id,
    "client_email" => $personalEmail,
    "client_tel" => $personalTel,
    "client_lastName" => ucfirst($personalLastName),
  ];

  // Build the dynamic email
  $emailBody = loadTemplate($templatePath, $variables);

  // Send email to client
  $clientEmailResponse = sendEmail(
    $email_host,
    $email_name,
    $email_pass,
    $email_port,
    $personalEmail,
    $subject,
    $emailBody,
    $replyto,
    $embededdImages
  );

  if ($clientEmailResponse['success']) {
    $to = 'contact@carwashfromhome.com';
    $subject = 'Nouveau rendez-vous de lavage de voiture';
    $replyTo = ['email' => $personalEmail, 'name' => $personalFirstName . ' ' . $personalLastName];
    $body =
      "<b>Informations personnelles:</b><br>
      Nom: $personalLastName<br>
      Prénom: $personalFirstName<br>
      Adresse: $personalAddress<br>
      Ville: $personalCity<br>
      Email: $personalEmail<br>
      Téléphone: $personalTel<br>
      Numéro de réservation: $order_id<br><br>
      
      <b>Informations de rendez-vous:</b><br>
      Date: $appointmentDate<br>
      Heure: $appointmentHour<br><br>
      
      <b>Informations sur le lavage:</b><br>
      Taille de la voiture: $washingCarSize<br>
      Classique: " . formatServices($washingClassic) . "<br>
      Finition: " . formatServices($washingFinishing) . "<br>
      Options: " . formatServices($washingOptions) . "<br>
      Message: $washingMessage<br>
      Prix: " . $washingPrice . "€<br>
      Durée: " . formatTime($washingTime) . "<br>";

    $adminEmailResponse = sendEmail(
      $email_host,
      $email_name,
      $email_pass,
      $email_port,
      $to,
      $subject,
      $body,
      $replyTo
    );

    echo json_encode([
      "success" => $adminEmailResponse['success'] && $clientEmailResponse['success'] && $order_id > 0,
      "clientResponse" => $clientEmailResponse['message'],
      "adminResponse" => $adminEmailResponse['message'],
      "databaseResponse" => "Added successfully",
    ]);
  }
}
