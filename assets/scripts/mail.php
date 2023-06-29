<?php
if(!isset($_POST['last-name'], $_POST['email'], $_POST['message'])){
  exit(0);
}

$to = "contact@carwashfromhome.com";
$subject = "rendez-vous";
$message = "Nom : " . $_POST['last-name'] . "\nEmail : " . $_POST['email'] . "\nMessage : " . $_POST['message'];

mail($to, $subject, $message, "Reply-to:" . $_POST['email']);

header("Location: ../../index.php#contact");
