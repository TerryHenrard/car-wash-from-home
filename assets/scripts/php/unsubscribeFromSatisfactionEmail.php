<?php
if (!isset($_GET["email"]) || $_SERVER["REQUEST_METHOD"] !== 'GET') {
  exit();
}

function isDevelopmentEnvironment()
{
  return preg_match('/develop/', __DIR__);
}

if (isDevelopmentEnvironment()) {
  require '../../../../../config.php'; // Development environment
} else {
  require '../../../../config.php'; // Production environment
}
require 'database.php';
require '../../classes/Database.php';
?>

<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Désabonnement à l'enquête</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9f9f9;
      color: #333;
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      text-align: center;
      max-width: 600px;
      margin: auto;
    }

    h1 {
      color: #d9534f;
    }

    h3 {
      color: #5a5a5a;
    }

    a {
      color: #d9534f;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  </style>
</head>

<body>
  <div class="container">
    <?php

    $id = insertIntoUnsubscribedSatisfactionEmail(urldecode($_GET["email"]));

    if ($id > 0) {
      echo "<h1>Vous vous êtes désabonné de l'enquête de satisfaction</h1>";
    } else {
      echo "<h1>Un problème est survenu</h1>";
      echo "<h3>Veuillez s'il vous plaît nous faire part de ce problème à <a href='mailto:contact@carwashfromhome.com'>contact@carwashfromhome.com</a></h3>";
    }
    ?>
  </div>
</body>

</html>