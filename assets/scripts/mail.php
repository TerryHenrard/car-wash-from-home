<?php
if(!isset($_POST['last-name'],
          $_POST['first-name'],
          $_POST['email'],
          $_POST['address'],
          $_POST['formule'],
          $_POST['date'],
          $_POST['time'],
          $_POST['message'])){
  exit(0);
}

$to = "contact@carwashfromhome.com";
$subject = "rendez-vous";
$message = "Nom : " . $_POST['last-name'] . "
            Prenom : " . $_POST['first-name'] . "
            email : " . $_POST['email'] . "
            adresse : " . $_POST['address'] . "
            formule : " . $_POST['formule'] . "
            date : " . $_POST['date'] . "
            heure : " . $_POST['time'] . "
            message : " . $_POST['message'];

mail($to, $subject, $message, "Reply-to:" . $_POST['email']);

header("Location: ../../index.html#rdv");
