<?php

$regexs = [
  "lastName" => '/^[\p{L}\s\-.\']{2,100}$/u',
  "firstName" => '/^[\p{L}\s\-.\']{2,100}$/u',
  "email" => '/^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/',
  "tel" => '/^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/',
  "address" => '/^[\p{L}\d\s\.,#‘’\'\-]{2,100}$/u',
  "city" => '/^[\p{L}][\p{L}\d\s\.,#‘’\'\-]{2,100}$/u',
  "message" => '/^[\p{L}a-zA-Z\d\s\/,\\#‘’\'"+:;?!+=$€*\/@().-]{0,250}$/u',
];

$validClassicWashes = ['Intérieur', 'Extérieur'];

$validOptions = [
  'Nettoyage bloc moteur',
  'Nettoyage cuir et alcantara',
  'Shampoing sièges en tissus',
  'Shampoing tapis et coffre',
  'Shampoing moquette'
];

$validFinishing = [
  'Polissage carrosserie',
  'Céramique carrosserie',
  'Céramique jantes',
  'Céramique vitres',
  'Rénovateur pneus',
  'Imperméabilisant textiles',
  'Protection cuir',
  'Anti buée',
  'Rénovateur joints',
  'Protection plastiques',
];

$validCarSizes = [
  'citadine',
  'berline_coupe',
  'break_suv',
  'camionnette_s',
  'camionnette_m',
  'camionnette_l'
];

$templatePath = "../../templates/mails/orderConfirmation.html";

$orderDetailTemplatePath = "../../templates/mails/orderDetail.html";

$embededdImages = [['cid' => 'logo_cwfh_path', 'imgPath' => '../../images/logo1.png']];

$classicImagePath = [
  normalizeKey("Extérieur") => "../../images/exterior_wash.jpg",
  normalizeKey("Intérieur") => "../../images/interior_wash.jpg"
];

$optionImagePaths = [
  normalizeKey("Nettoyage bloc moteur") => "../../images/bloc-moteur.png",
  normalizeKey("Nettoyage cuir et alcantara") => "../../images/sieges-cuir.png",
  normalizeKey("Shampoing sièges en tissus") => "../../images/shampouineuse.png",
  normalizeKey("Shampoing tapis et coffre") => "../../images/tapis.png",
  normalizeKey("Shampoing moquette") => "../../images/nettoyage-moquette.jpg"
];

$finishingImagePaths = [
  normalizeKey("Polissage carrosserie") => "../../images/polissage.png",
  normalizeKey("Céramique carrosserie") => "../../images/ceramique2.png",
  normalizeKey("Céramique jantes") => "../../images/ceramique-jante.png",
  normalizeKey("Céramique vitres") => "../../images/ceramique-vitre.png",
  normalizeKey("Rénovateur pneus") => "../../images/renovateur-pneus.png",
  normalizeKey("Imperméabilisant textiles") => "../../images/impermeabilisant-textile.png",
  normalizeKey("Protection cuir") => "../../images/protection-cuir.png",
  normalizeKey("Anti buée") => "../../images/anti-buee.png",
  normalizeKey("Rénovateur joints") => "../../images/renovateur-joints.png",
  normalizeKey("Protection plastiques") => "../../images/protection-plastique.png"
];

function normalizeKey($key)
{
  $normalized = iconv('UTF-8', 'ASCII//TRANSLIT', $key); // Convertir les accents en caractères ASCII
  $normalized = preg_replace('/[^a-zA-Z0-9_]/', '_', $normalized); // Remplacer les caractères non alphanumériques par des underscores
  return $normalized;
}
