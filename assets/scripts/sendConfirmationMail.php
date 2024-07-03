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

function extractNames($array)
{
  return array_map(function ($item) {
    return $item['name'];
  }, $array);
}

function validateArrayInArray($array, $validArray)
{
  $names = extractNames($array);
  return is_array($names) && empty(array_diff($names, $validArray));
}

function validateValueInArray($value, $validArray)
{
  return in_array($value, $validArray);
}

function validateInt($value)
{
  return is_numeric($value);
}

function validateItems($items, $validNames)
{
  foreach ($items as $item) {
    if (!isset($item['name'], $item['price'], $item['time'])) {
      return false;
    }
    if (!validateValueInArray($item['name'], $validNames) || !validateInt($item['price']) || !validateInt($item['time'])) {
      return false;
    }
  }
  return true;
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
  'Nettoyage bloc moteur',
  'Nettoyage cuir et alcantara',
  'Shampoing sièges en tissus',
  'Shampoing tapis et coffre',
  'Shampoing moquette'
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

// If arrived here data are secure

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../libraries/phpmailer/Exception.php';
require '../libraries/phpmailer/PHPMailer.php';
require '../libraries/phpmailer/SMTP.php';
require '../../../../config.php';

function formatTime($minutes)
{
  $hours = floor($minutes / 60);
  $remainingMinutes = $minutes % 60;

  $formattedHours = str_pad($hours, 2, '0', STR_PAD_LEFT);
  $formattedMinutes = str_pad($remainingMinutes, 2, '0', STR_PAD_LEFT);

  return "{$formattedHours}h{$formattedMinutes}";
}

function loadTemplate($filePath, $variables = [])
{
  if (file_exists($filePath)) {
    $template = file_get_contents($filePath);
    foreach ($variables as $key => $value) {
      $template = str_replace("{{" . $key . "}}", $value, $template);
    }
    return $template;
  }
  return false;
}

$templatePath = "../templates/orderConfirmation.html";
$variables = [
  "logo_cwfh_path" => "../images/logo4.webp",
  "order_id" => 1,
  "appointment_date" => $appointmentDate,
  "appointment_hour" => $appointmentHour,
  "order_total" => $washingPrice . '€',
  "order_time" => formatTime($washingTime),
  "client_email" => $personalEmail,
  "client_address" => $personalAddress . ', ' . ucfirst($personalCity),
];
$emailBody = loadTemplate($templatePath, $variables);

$mail = new PHPMailer(true);

try {
  //Server settings
  $mail->SMTPDebug = SMTP::DEBUG_OFF;                         //Enable verbose debug output
  $mail->isSMTP();                                            //Send using SMTP
  $mail->Host       = $email_host;                            //Set the SMTP server to send through
  $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
  $mail->Username   = $email_name;                            //SMTP username
  $mail->Password   = $email_pass;                            //SMTP password
  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
  $mail->Port       = $email_port;                            //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

  //Recipients
  $mail->setFrom('contact@carwashfromhome.com', 'Car Wash From Home');
  $mail->addAddress($personalEmail, $personalFirstName . ' ' . $personalLastName); //Add a recipient
  $mail->addReplyTo('contact@carwashfromhome.com', 'Car Wash From Home');

  //Content
  $mail->CharSet = "UTF-8";
  $mail->isHTML(true);                                          //Set email format to HTML
  $mail->Subject = 'Confirmation du rendez-vous du ' . $appointmentDate . ' au ' . $personalAddress . ' ' . $personalCity;
  $mail->addEmbeddedImage("../images/logo1.png", "logo_cwfh_path");
  $mail->Body    = $emailBody;

  $mail->send();
  echo json_encode(["success" => true, "message" => "Email has been sent"]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "message" => "Email hasn't been sent: $mail->ErrorInfo", "exception" => $e->getMessage()]);
}
