<?php

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

$validClassicWashes = ['Intérieur', 'Extérieur'];

$regexs = [
  "lastName" => '/^[\p{L}\s\-.\']{2,100}$/u',
  "firstName" => '/^[\p{L}\s\-.\']{2,100}$/u',
  "email" => '/^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$/',
  "tel" => '/^(?:([+]\d{1,4})[-.\s]?)?(?:[(](\d{1,3})[)][-.\s]?)?(\d{1,4})[-.\s]?(\d{1,4})[-.\s]?(\d{1,9})$/',
  "address" => '/^[\p{L}\d\s\.,#‘’\'\-]{2,100}$/u',
  "city" => '/^[\p{L}][\p{L}\d\s\.,#‘’\'\-]{2,100}$/u',
  "message" => '/^[\p{L}a-zA-Z\d\s\/,\\#‘’\'"+:;?!+=$€*\/@().-]{0,250}$/u',
];

function sanitizeAppointmentData($data)
{
  return [
    'appointment_date' => preventScriptTag($data['appointmentInfos']['date'] ?? null),
    'appointment_hour' => preventScriptTag($data['appointmentInfos']['hour'] ?? null),
    'personal_address' => preventScriptTag($data['personnalInfos']['address'] ?? null),
    'personal_city' => preventScriptTag($data['personnalInfos']['city'] ?? null),
    'personal_email' => preventScriptTag($data['personnalInfos']['email'] ?? null),
    'personal_first_name' => preventScriptTag($data['personnalInfos']['firstName'] ?? null),
    'personal_last_name' => preventScriptTag($data['personnalInfos']['lastName'] ?? null),
    'personal_tel' => preventScriptTag($data['personnalInfos']['tel'] ?? null),
    'washing_car_size' => preventScriptTag($data['washingInfos']['carSize'] ?? null),
    'washing_classic' => $data['washingInfos']['classic'] ?? [],
    'washing_finishing' => $data['washingInfos']['finishing'] ?? [],
    'washing_message' => preventScriptTag($data['washingInfos']['message'] ?? null),
    'washing_options' => $data['washingInfos']['options'] ?? [],
    'washing_price' => (int)($data['washingInfos']['price'] ?? 0),
    'washing_time' => (int)($data['washingInfos']['time'] ?? 0),
  ];
}

function validateAppointmentData($data)
{
  global $regexs, $validClassicWashes, $validFinishing, $validOptions, $validCarSizes;

  return
    validateDate($data['appointment_date']) &&
    validateTime($data['appointment_hour']) &&
    validateWithRegex($data['personal_address'], $regexs["address"]) &&
    validateWithRegex($data['personal_city'], $regexs["city"]) &&
    validateWithRegex($data['personal_email'], $regexs["email"]) &&
    validateWithRegex($data['personal_first_name'], $regexs["firstName"]) &&
    validateWithRegex($data['personal_last_name'], $regexs["lastName"]) &&
    validateWithRegex($data['personal_tel'], $regexs["tel"]) &&
    validateValueInArray($data["washing_car_size"], $validCarSizes) &&
    validateItems($data['washing_classic'], $validClassicWashes) &&
    validateItems($data['washing_finishing'], $validFinishing) &&
    validateWithRegex($data['washing_message'], $regexs["message"]) &&
    validateItems($data['washing_options'], $validOptions) &&
    validateInt($data['washing_price']) &&
    validateInt($data['washing_time']);
}

function preventScriptTag($str)
{
  return preg_replace("/<script>|<\/script>/i", ">scrapt<", $str);
}

function validateDate($date, $format = 'd/m/Y')
{
  $d = DateTime::createFromFormat($format, $date);
  return $d && $d->format($format) === $date && checkdate($d->format('m'), $d->format('d'), $d->format('Y'));
}

function validateTime($time, $format = 'H:i')
{
  $d = DateTime::createFromFormat($format, $time);

  if ($d && $d->format($format) === $time) {
    $hour = $d->format('H');
    $minute = $d->format('i');

    if ($hour >= 0 && $hour <= 23 && $minute >= 0 && $minute <= 59) {
      return true;
    }
  }

  return false;
}

function validateWithRegex($value, $regex)
{
  return preg_match($regex, $value);
}

function extractNames($array)
{
  return array_map(function ($item) {
    return $item['name'];
  }, $array);
}

function validateArrayInArray($array, $validArray)
{
  $names = extractNames($array);
  return is_array($names) && empty(array_diff($names, $validArray));
}

function validateValueInArray($value, $validArray)
{
  return in_array($value, $validArray);
}

function validateInt($value)
{
  return is_numeric($value);
}

function validateItems($items, $validNames)
{
  foreach ($items as $item) {
    if (!isset($item['name'], $item['price'], $item['time'])) {
      return false;
    }
    if (!validateValueInArray($item['name'], $validNames) || !validateInt($item['price']) || !validateInt($item['time'])) {
      return false;
    }
  }
  return true;
}
