<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../../libraries/phpmailer/Exception.php';
require '../../libraries/phpmailer/PHPMailer.php';
require '../../libraries/phpmailer/SMTP.php';

$classicImagePaths = [
  normalizeKey("Extérieur") => "../../images/exterior_wash.jpg",
  normalizeKey("Intérieur") => "../../images/interior_wash.jpg"
];

$optionImagePaths = [
  normalizeKey("Nettoyage bloc moteur") => "../../images/bloc-moteur.png",
  normalizeKey("Nettoyage cuir et alcantara") => "../../images/sieges-cuir.png",
  normalizeKey("Shampoing sièges en tissus") => "../../images/shampouineuse.png",
  normalizeKey("Shampoing tapis et coffre") => "../../images/tapis.png",
  normalizeKey("Shampoing moquette") => "../../images/nettoyage-moquette.jpg"
];

$finishingImagePaths = [
  normalizeKey("Polissage carrosserie") => "../../images/polissage.png",
  normalizeKey("Céramique carrosserie") => "../../images/ceramique2.png",
  normalizeKey("Céramique jantes") => "../../images/ceramique-jante.png",
  normalizeKey("Céramique vitres") => "../../images/ceramique-vitre.png",
  normalizeKey("Rénovateur pneus") => "../../images/renovateur-pneus.png",
  normalizeKey("Imperméabilisant textiles") => "../../images/impermeabilisant-textile.png",
  normalizeKey("Protection cuir") => "../../images/protection-cuir.png",
  normalizeKey("Anti buée") => "../../images/anti-buee.png",
  normalizeKey("Rénovateur joints") => "../../images/renovateur-joints.png",
  normalizeKey("Protection plastiques") => "../../images/protection-plastique.png"
];

function normalizeKey($key)
{
  $normalized = iconv('UTF-8', 'ASCII//TRANSLIT', $key); // Convertir les accents en caractères ASCII
  $normalized = preg_replace('/[^a-zA-Z0-9_]/', '_', $normalized); // Remplacer les caractères non alphanumériques par des underscores
  return $normalized;
}

function sendEmail($email_host, $email_name, $email_pass, $email_port, $to, $subject, $body, $replyTo = null, $embededdImages = [])
{
  global $email_host, $email_name, $email_pass, $email_port;

  $mail = new PHPMailer(true);

  try {
    //Server settings
    $mail->SMTPDebug  = SMTP::DEBUG_OFF;
    $mail->isSMTP();
    $mail->Host       = $email_host;
    $mail->SMTPAuth   = true;
    $mail->Username   = $email_name;
    $mail->Password   = $email_pass;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = $email_port;

    //Recipients
    $mail->setFrom('contact@carwashfromhome.com', 'Car Wash From Home');
    $mail->addAddress($to);
    if ($replyTo) {
      $mail->addReplyTo($replyTo['email'], $replyTo['name']);
    } else {
      $mail->addReplyTo('contact@carwashfromhome.com', 'Car Wash From Home');
    }

    //Content
    $mail->CharSet = "UTF-8";
    $mail->isHTML(true);
    $mail->Subject = $subject;
    foreach ($embededdImages as $embededdImage) {
      $mail->addEmbeddedImage($embededdImage["imgPath"], $embededdImage["cid"]);
    }
    $mail->Body    = $body;

    $mail->send();
    return ["success" => true, "message" => "Email has been sent"];
  } catch (Exception $ex) {
    return ["success" => false, "message" => "Email hasn't been sent:" . $ex->errorMessage()];
  } catch (\Exception $ex) {
    return ["success" => false, "message" => "Email hasn't been sent:" . $ex->getMessage()];
  }
}

function loadTemplate($filePath, $variables = [])
{
  if (!file_exists($filePath))
    return false;

  $template = file_get_contents($filePath);

  foreach ($variables as $key => $value) {
    $template = str_replace('{{' . $key . '}}', $value, $template);
  }

  return $template;
}

function buildOrderDetails($services, $washingCarSize, $templatePath, $imagePaths, &$embededdImages)
{
  $orderDetails = "";

  foreach ($services as $service) {
    $nameKey = normalizeKey($service["name"]);
    $imgPath = $imagePaths[$nameKey];
    $imgCid = 'cid:' . $nameKey;
    $embededdImages[] = ["cid" => $nameKey, "imgPath" => $imgPath];

    $orderDetails .= loadTemplate($templatePath, [
      "img_path" => $imgCid,
      "service_name" => $service["name"],
      "car_size" =>
      in_array($service["name"], ["Polissage carrosserie", "Céramique carrosserie", "Intérieur", "Extérieur"])
        ? "type: $washingCarSize"
        : "",
      "service_price" => $service["price"] . '€',
      "service_time" => formatTime($service["time"])
    ]);
  }
  return $orderDetails;
}

function sendClientConfirmationEmail($data, $order_id)
{
  global $email_host, $email_name, $email_pass, $email_port, $classicImagePaths, $optionImagePaths, $finishingImagePaths;

  $orderDetailTemplatePath = "../../templates/mails/clientOrderDetail.html";
  $embededdImages = [['cid' => 'logo_cwfh_path', 'imgPath' => '../../images/logo1.png']];
  $replyto = ['email' => 'contact@carwashfromhome.com', 'name' => 'Car Wash From Home'];
  $subject = 'Confirmation du rendez-vous du ' . $data['appointment_date'] . ' à ' . $data['personal_address'] . ' ' . $data['personal_city'];
  $variables = [
    "logo_cwfh_path" => "../images/logo4.webp",
    "client_firstName" => ucfirst($data['personal_first_name']),
    "appointment_date" => $data['appointment_date'],
    "appointment_hour" => $data['appointment_hour'],
    "client_address" => $data['personal_address'] . ', ' . ucfirst($data['personal_city']),
    "order_details" =>
    buildOrderDetails($data['washing_classic'], $data["washing_car_size"], $orderDetailTemplatePath, $classicImagePaths, $embededdImages) .
      buildOrderDetails($data['washing_options'], $data["washing_car_size"], $orderDetailTemplatePath, $optionImagePaths, $embededdImages) .
      buildOrderDetails($data['washing_finishing'], $data["washing_car_size"], $orderDetailTemplatePath, $finishingImagePaths, $embededdImages),
    "order_total" => $data['washing_price'] . '€',
    "order_time" => formatTime($data['washing_time']),
    "order_id" => $order_id,
    "client_email" => $data['personal_email'],
    "client_tel" => $data['personal_tel'],
    "client_lastName" => ucfirst($data['personal_last_name']),
  ];
  $templatePath = "../../templates/mails/clientOrderConfirmation.html";
  $emailBody = loadTemplate($templatePath, $variables);

  return sendEmail(
    $email_host,
    $email_name,
    $email_pass,
    $email_port,
    $data['personal_email'],
    $subject,
    $emailBody,
    $replyto,
    $embededdImages
  );
}

function sendAdminNotificationEmail($data, $order_id)
{
  global $email_host, $email_name, $email_pass, $email_port;

  $subject = 'Nouveau rendez-vous de lavage de voiture';
  $replyTo = ['email' => $data['personal_email'], 'name' => $data['personal_first_name'] . ' ' . $data['personal_last_name']];
  $templatePath = '../../templates/mails/adminAppointmentAlert.html';
  $variables = [
    'personal_last_name' => $data['personal_last_name'],
    'personal_first_name' => $data['personal_first_name'],
    'personal_address' => $data['personal_address'],
    'personal_city' => $data['personal_city'],
    'personal_email' => $data['personal_email'],
    'personal_tel' => $data['personal_tel'],
    'order_id' => $order_id,
    'appointment_date' => $data['appointment_date'],
    'appointment_hour' => $data['appointment_hour'],
    'washing_car_size' => $data['washing_car_size'],
    'format_services_washing_classic' => formatServices($data['washing_classic']),
    'format_services_washing_finishing' => formatServices($data['washing_finishing']),
    'format_services_washing_options' => formatServices($data['washing_options']),
    'washing_message' => $data['washing_message'],
    'washing_price' => $data['washing_price'],
    'format_time_washing_time' => formatTime($data['washing_time'])
  ];

  $emailBody = loadTemplate($templatePath, $variables);

  return sendEmail(
    $email_host,
    $email_name,
    $email_pass,
    $email_port,
    'contact@carwashfromhome.com',
    $subject,
    $emailBody,
    $replyTo
  );
}
