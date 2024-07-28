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
  <div class="admin-container">
    <header>
      <h1>Bilan financier</h1>
    </header>
    <section class="dashboard">
      <div class="card">
        <h2>Chiffre d'Affaires total</h2>
        <p id="turnover"></p>
      </div>
      <div class="card">
        <h2>Chiffre d'Affaires <span id="curr-year"></span></h2>
        <p id="turnover-curr-year"></p>
      </div>
      <div class="card">
        <h2>Total des Charges</h2>
        <p id="total-costs"></p>
      </div>
      <div class="card">
        <h2>Total des Produits</h2>
        <p id="total-results"></p>
      </div>
      <div class="card">
        <h2>Bénéfices</h2>
        <p id="profit"></p>
      </div>
      <div class="card">
        <h2>Pertes</h2>
        <p id="loss"></p>
      </div>
      <div class="card">
        <h2>Total int/ext</h2>
        <p id="total-classic-wash"></p>
      </div>
      <div class="card">
        <h2>Total options</h2>
        <p id="total-options"></p>
      </div>
      <div class="card">
        <h2>Total finitions</h2>
        <p id="total-finishing"></p>
      </div>

      <div class="card">
        <h2>Revenu Moyen par Véhicule</h2>
        <p id="revenu-per-car"></p>
      </div>
      <div class="card">
        <h2>Nombre de Véhicules</h2>
        <p id="total-vehicules"></p>
      </div>
      <div class="card">
        <h2>Marge net</h2>
        <p id="net-margin"></p>
      </div>
    </section>
    <div>
      <a href="./dashboard.php?admin_token=<?php echo urlencode($_SESSION["admin_token"]) ?>">retour</a>
    </div>
  </div>
</body>

</html>