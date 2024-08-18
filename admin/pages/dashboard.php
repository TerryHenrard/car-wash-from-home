<?php
session_start();
if (
  !isset($_GET["admin_token"], $_SESSION["admin_token"]) ||
  $_GET["admin_token"] != $_SESSION["admin_token"]
) {
  header("Location: ../index.php");
  exit();
}
?>

<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Panel</title>
  <link rel="stylesheet" href="../assets/style/style.css">
  <script src="../assets/scripts/js/main.js" defer></script>
</head>

<body>
  <ol>
    <li>
      <a href="./StatementOfAccount.php?admin_token=<?php echo urlencode($_SESSION["admin_token"]) ?>">bilan financier</a>
    </li>
  </ol>
</body>

</html>