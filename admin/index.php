<?php
session_start();
function generateAdminToken()
{
  if (!isset($_SESSION['admin_token'])) {
    $_SESSION['admin_token'] = bin2hex(random_bytes(32));
  }
  return $_SESSION['admin_token'];
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page de Connexion</title>
  <link rel="stylesheet" href="./assets/style/style.css">
</head>

<body>
  <div class="container">
    <div class="login-box">
      <h2>Connexion</h2>
      <form method="post" action="./assets/scripts/php/login.php">
        <div class="textbox">
          <input type="text" name="email" id="email" required>
          <label>Email</label>
        </div>
        <div class="textbox">
          <input type="password" name="password" id="password" required>
          <label>Mot de passe</label>
        </div>
        <button type="submit" class="btn">Se connecter</button>
        <input type="hidden" name="admin_token" value="<?php echo generateAdminToken() ?>">
      </form>
    </div>
  </div>
</body>

</html>