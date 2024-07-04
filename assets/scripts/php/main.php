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

require 'validation.php';
require 'data.php';
require 'email.php';
// require 'database.php'; TODO: add order in database

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
  "order_id" => "",
  "client_email" => $personalEmail,
  "client_tel" => $personalTel,
  "client_lastName" => ucfirst($personalLastName),
];
// Build the dynamic email
$emailBody = loadTemplate($templatePath, $variables);

// Send email to client
$clientEmailResponse = sendEmail(
  $personalEmail,
  'Confirmation du rendez-vous du ' . $appointmentDate . ' à ' . $personalAddress . ' ' . $personalCity,
  $emailBody,
  null,
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
      Téléphone: $personalTel<br><br>
      
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

  $adminEmailResponse = sendEmail($to, $subject, $body, $replyTo);

  echo json_encode([
    "success" => $adminEmailResponse['success'] && $clientEmailResponse['success'],
    "clientResponse" => $clientEmailResponse['message'],
    "adminResponse" => $adminEmailResponse['message']
  ]);
}
