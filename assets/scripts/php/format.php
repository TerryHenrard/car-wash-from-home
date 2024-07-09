<?php

function formatServices($services)
{
  $result = [];
  foreach ($services as $service) {
    $result[] = "&bull; " . $service['name'] . ' (' . $service['price'] . '€, ' . formatTime($service['time']) . ')<br>';
  }
  return implode('', $result);
}

function formatTime($minutes)
{
  return sprintf('%02dh%02d', floor($minutes / 60), $minutes % 60);
}
