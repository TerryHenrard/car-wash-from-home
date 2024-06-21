<?php
session_start();
if (!isset($_POST/*, $_SESSION['csrf_token']*/) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
  exit();
}
/*
if ($_POST["csrf_token"] !== $_SESSION['csrf_token']) {
  exit();
}*/

function sanitizeString($str)
{
  return htmlspecialchars($str, ENT_QUOTES, 'UTF-8')/* && preg_match("/<script/i", $str)*/;
}

function validateDate($date, $format = 'd/m/Y')
{
  $d = DateTime::createFromFormat($format, $date);
  return $d && $d->format($format) === $date;
}

function validateTime($time, $format = 'H:i')
{
  $d = DateTime::createFromFormat($format, $time);
  return $d && $d->format($format) === $time;
}

function validateWithRegex($value, $regex)
{
  return preg_match($regex, $value);
}

function validateEmail($email)
{
  return filter_var($email, FILTER_VALIDATE_EMAIL);
}

function validateArray($array, $validArray)
{
  return is_array($array) && empty(array_diff($array, $validArray));
}

function validateCarSize($carSize, $validCarSizes)
{
  return in_array($carSize, $validCarSizes);
}

function validateInt($value)
{
  return filter_var($value, FILTER_VALIDATE_INT);
}

$regexs = [
  "lastName" => '/^[\p{L}\s\-.\']{2,100}$/u',
  "firstName" => '/^[\p{L}\s\-.\']{2,100}$/u',
  "email" => '/^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/',
  "tel" => '/^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/',
  "address" => '/^[\p{L}\d\s\.,#‘’\'\-]{2,100}$/u',
  "city" => '/^[\p{L}][\p{L}\d\s\.,#‘’\'\-]{2,100}$/u',
  "message" => '/^[\p{L}a-zA-Z\d\s\/,\\#‘’\'"+:;?!+=$€*\/@().-]{0,250}$/u',
];

$validClassicWashes = ['Intérieur', 'Extérieur'];
$validOptions = [
  'Nettoyage du bloc moteur',
  'Nettoyage des sièges en cuir et en alcantara',
  'Shampoing des sièges en tissus',
  'Shampoing des tapis et du coffre',
  'Shampoing de la moquette'
];
$validFinishing = [
  'Polissage carrosserie',
  'Céramique carrosserie',
  'Céramique jantes',
  'Céramique vitres',
  'Rénovateur pneus',
  'Imperméabilisant textiles',
  'Protection cuir',
  'Anti buée',
  'Rénovateur joints',
  'Protection plastiques',
];
$validCarSizes = [
  'citadine',
  'berline_coupe',
  'break_suv',
  'camionnette_s',
  'camionnette_m',
  'camionnette_l'
];


// Decode JSON input
$requestData = json_decode(file_get_contents("php://input"), true);

// Extract data from JSON and sanitize
$appointmentDate = sanitizeString($requestData['appoitmentInfos']['date'] ?? null);
$appointmentTime = sanitizeString($requestData['appoitmentInfos']['hour'] ?? null);
$personalAddress = sanitizeString($requestData['personnalInfos']['address'] ?? null);
$personalCity = sanitizeString($requestData['personnalInfos']['city'] ?? null);
$personalEmail = sanitizeString($requestData['personnalInfos']['email'] ?? null);
$personalFirstName = sanitizeString($requestData['personnalInfos']['firstName'] ?? null);
$personalLastName = sanitizeString($requestData['personnalInfos']['lastName'] ?? null);
$personalTel = sanitizeString($requestData['personnalInfos']['tel'] ?? null);
$washingCarSize = sanitizeString($requestData['washingInfos']['carSize'] ?? null);
$washingClassic = array_map('sanitizeString', $requestData['washingInfos']['classic'] ?? []);
$washingFinishing = array_map('sanitizeString', $requestData['washingInfos']['finishing'] ?? []);
$washingMessage = sanitizeString($requestData['washingInfos']['message'] ?? null);
$washingOptions = array_map('sanitizeString', $requestData['washingInfos']['options'] ?? []);
$washingPrice = (int)($requestData['washingInfos']['price'] ?? 0);
$washingTime = (int)($requestData['washingInfos']['time'] ?? 0);

if (
  !validateDate($appointmentDate) ||
  !validateTime($appointmentTime) ||
  !validateWithRegex($personalAddress, $regexs["address"]) ||
  !validateWithRegex($personalCity, $regexs["city"]) ||
  !validateEmail($personalEmail) ||
  !validateWithRegex($personalEmail, $regexs["email"]) ||
  !validateWithRegex($personalFirstName, $regexs["firstName"]) ||
  !validateWithRegex($personalLastName, $regexs["lastName"]) ||
  !validateWithRegex($personalTel, $regexs["tel"]) ||
  !validateArray($washingClassic, $validClassicWashes) ||
  !validateArray($washingFinishing, $validFinishing) ||
  !validateWithRegex($washingMessage, $regexs["message"]) ||
  !validateArray($washingOptions, $validOptions) ||
  !validateInt($washingPrice) ||
  !validateInt($washingTime)
) {
  exit();
}

// If arrived here data are secure

// Prepare email content
$subject = "Nouveau rendez-vous de lavage de voiture";
$body = "
<b>Informations personnelles:</b><br>
Nom: $personalLastName<br>
Prénom: $personalFirstName<br>
Adresse: $personalAddress<br>
Ville: $personalCity<br>
Email: $personalEmail<br>
Téléphone: $personalTel<br><br>

<b>Informations de rendez-vous:</b><br>
Date: $appointmentDate<br>
Heure: $appointmentTime<br><br>

<b>Informations sur le lavage:</b><br>
Taille de la voiture: $washingCarSize<br>
Classique: " . implode(', ', $washingClassic) . "<br>
Finition: " . implode(', ', $washingFinishing) . "<br>
Options: " . implode(', ', $washingOptions) . "<br>
Message: $washingMessage<br>
Prix: $washingPrice €<br>
Durée: $washingTime minutes<br>
";

// Headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: <contact@carwashfromhome.com>" . "\r\n";

// Send email
$mailSent = mail("contact@carwashfromhome.com", $subject, $body, $headers);

if ($mailSent) {
  echo json_encode(["success" => true, "message" => "Email envoyé avec succès."]);
} else {
  echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi de l'email."]);
}
