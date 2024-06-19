<?php

$jsonData = file_get_contents('php://input');

$objet = json_decode($jsonData, false, 512, JSON_THROW_ON_ERROR);

$wash = "";
foreach ($objet->classic as $element) {
  $wash .= $element . " ";
}

$options = "";
foreach ($objet->options as $element) {
  $options .= $element . " ";
}

$finishing = "";
foreach ($objet->finishing as $element) {
  $finishing .= $element . " ";
}

$to = "contact@carwashfromhome.com";
$subject = "rendez-vous";
$body = "nom : " . $objet->lastName . "
prenom : " . $objet->firstName . "
email : " . $objet->email . "
telephone : " . $objet->tel . "
adresse : " . $objet->address . "
ville : " . $objet->city . "
taille : " . $objet->carSize . "
formule : " . $wash . "
options : " . $options . "
finitions : " . $finishing . "
date : " . $objet->date . "
heure : " . $objet->hour . "
prix : " . $objet->price . "euros
temps : " . $objet->time . "min
message : " . $objet->message;

mail($to, $subject, $body, "Reply-to:" . $objet->email);
