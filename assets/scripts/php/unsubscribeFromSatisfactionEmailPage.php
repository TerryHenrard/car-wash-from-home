<?php
if (!isset($_GET) || $_SERVER["REQUEST_METHOD"] !== 'GET') {
  exit();
}
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
      max-width: 400px;
      margin: auto;
    }

    h1 {
      color: #d9534f;
    }

    h3 {
      color: #5a5a5a;
    }

    .buttons {
      margin-top: 20px;
    }

    .buttons a {
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      color: #fff;
      margin: 0 10px;
      display: inline-block;
    }

    .buttons a.cancel {
      background-color: #5bc0de;
    }

    .buttons a.unsubscribe {
      background-color: #d9534f;
    }
  </style>
</head>

<body>
  <div class="container">
    <h1>Êtes-vous sûr de vouloir vous désabonner ?</h1>
    <h3>En cliquant sur ce bouton, vous ne recevrez plus jamais d'enquête de satisfaction par mail, même si vous refaites appel aux services de Car Wash From Home.</h3>

    <div class="buttons">
      <a href="https://carwashfromhome.com" class="cancel">Annuler</a>
      <a href="https://carwashfromhome.com/assets/scripts/php/unsubscribeFromSatisfactionEmail.php?email=<?php echo urlencode($_GET["email"]) ?>" class="unsubscribe">Se désabonner</a>
    </div>
  </div>
</body>

</html>