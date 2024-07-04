<?php

function preventScriptTag($str)
{
  return preg_replace("/<script>|<\/script>/i", ">ptircs<", $str);
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
