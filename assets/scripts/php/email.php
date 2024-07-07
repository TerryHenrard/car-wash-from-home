<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require '../../libraries/phpmailer/Exception.php';
require '../../libraries/phpmailer/PHPMailer.php';
require '../../libraries/phpmailer/SMTP.php';

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

function formatTime($minutes)
{
  return sprintf('%02dh%02d', floor($minutes / 60), $minutes % 60);
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

function buildOrderDetails($services, $templatePath, $imagePaths)
{
  global $embededdImages, $washingCarSize;
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

function formatServices($services)
{
  $result = [];
  foreach ($services as $service) {
    $result[] = "<br>&nbsp;&nbsp;&bull; " . $service['name'] . ' (' . $service['price'] . '€, ' . formatTime($service['time']) . ')';
  }
  return implode(', ', $result);
}
