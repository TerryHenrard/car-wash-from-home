<?php
session_start();

function isDevelopmentEnvironment()
{
  return preg_match('/develop/', __DIR__);
}

if (isDevelopmentEnvironment()) {
  require '../../../../../config.php'; // Development environment
} else {
  require '../../../../config.php'; // Production environment
}

require './database.php';
require '../../classes/Database.php';

header('Content-Type: application/json');
echo json_encode(getFuturAppointmentDateAndHour());
