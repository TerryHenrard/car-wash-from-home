<?php
session_start();
if (!isset($_POST, $_SESSION['csrf_token']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
  exit();
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

if ($data["csrf_token"] !== $_SESSION['csrf_token']) {
  exit();
}

function preventScriptTag($str)
{
  return preg_replace("/<script>|<\/script>/i", ">ptircs<", $str);
}

function validateDate($date, $format = 'd/m/Y')
{
  $d = DateTime::createFromFormat($format, $date);
  return $d && $d->format($format) === $date && checkdate($d->format('m'), $d->format('d'), $d->format('Y'));
}

function validateTime($time, $format = 'H:i')
{
  $d = DateTime::createFromFormat($format, $time);

  if ($d && $d->format($format) === $time) {
    $hour = $d->format('H');
    $minute = $d->format('i');

    if ($hour >= 0 && $hour <= 23 && $minute >= 0 && $minute <= 59) {
      return true;
    }
  }

  return false;
}

function validateWithRegex($value, $regex)
{
  return preg_match($regex, $value);
}

function validateArrayInArray($array, $validArray)
{
  return is_array($array) && empty(array_diff($array, $validArray));
}

function validateValueInArray($value, $validArray)
{
  return in_array($value, $validArray);
}

function validateInt($value)
{
  return is_numeric($value);
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

// Extract data from JSON and sanitize
$appointmentDate = preventScriptTag($data['appoitmentInfos']['date'] ?? null);
$appointmentTime = preventScriptTag($data['appoitmentInfos']['hour'] ?? null);
$personalAddress = preventScriptTag($data['personnalInfos']['address'] ?? null);
$personalCity = preventScriptTag($data['personnalInfos']['city'] ?? null);
$personalEmail = preventScriptTag($data['personnalInfos']['email'] ?? null);
$personalFirstName = preventScriptTag($data['personnalInfos']['firstName'] ?? null);
$personalLastName = preventScriptTag($data['personnalInfos']['lastName'] ?? null);
$personalTel = preventScriptTag($data['personnalInfos']['tel'] ?? null);
$washingCarSize = preventScriptTag($data['washingInfos']['carSize'] ?? null);
$washingClassic = array_map('preventScriptTag', $data['washingInfos']['classic'] ?? []);
$washingFinishing = array_map('preventScriptTag', $data['washingInfos']['finishing'] ?? []);
$washingMessage = preventScriptTag($data['washingInfos']['message'] ?? null);
$washingOptions = array_map('preventScriptTag', $data['washingInfos']['options'] ?? []);
$washingPrice = (int)($data['washingInfos']['price'] ?? 0);
$washingTime = (int)($data['washingInfos']['time'] ?? 0);

if (
  !validateDate($appointmentDate) ||
  !validateTime($appointmentTime) ||
  !validateWithRegex($personalAddress, $regexs["address"]) ||
  !validateWithRegex($personalCity, $regexs["city"]) ||
  !validateWithRegex($personalEmail, $regexs["email"]) ||
  !validateWithRegex($personalFirstName, $regexs["firstName"]) ||
  !validateWithRegex($personalLastName, $regexs["lastName"]) ||
  !validateWithRegex($personalTel, $regexs["tel"]) ||
  !validateArrayInArray($washingClassic, $validClassicWashes) ||
  !validateArrayInArray($washingFinishing, $validFinishing) ||
  !validateWithRegex($washingMessage, $regexs["message"]) ||
  !validateArrayInArray($washingOptions, $validOptions) ||
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
  echo json_encode(["success" => true, "message" => "Email sent with success"]);
} else {
  echo json_encode(["success" => false, "message" => "Error while sending email"]);
}
