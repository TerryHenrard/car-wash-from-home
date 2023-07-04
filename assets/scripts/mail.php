<?php

$jsonData = file_get_contents('php://input');

$objet = json_decode($jsonData, false, 512, JSON_THROW_ON_ERROR);

$formule = "";
foreach ($objet->formule as $element){
  $formule .= $element . " ";
}

$abonnement = "";
foreach ($objet->abonnement as $element){
  $abonnement .= $element . " ";
}

$option = "";
foreach ($objet->option as $element){
  $option .= $element . " ";
}

$to = "contact@carwashfromhome.com";
$subject = "rendez-vous";
$body = "nom : " . $objet->lastName . "
prenom : " . $objet->firstName . "
email : " . $objet->email . "
telephone : " . $objet->phoneNumber . "
adresse : " . $objet->streetAndNumber . "
code postal : " . $objet->postcode . "
formule : " . $formule . "
abonnement : " . $abonnement . "
option : " . $option . "
date : " . $objet->date . "
heure : " . $objet->hours . "
prix : " . $objet->price . "euros
temps : " . $objet->time . "min
message : " . $objet->message;

mail($to, $subject, $body, "Reply-to:" . $objet->email);

header("Location: ../../index.html#rdv");