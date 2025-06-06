<?php
session_start();

function generateCsrfToken()
{
  $_SESSION['csrf_token'] = bin2hex(random_bytes(32));

  return $_SESSION['csrf_token'];
}

header('Content-Type: application/json');
echo json_encode(['csrf_token' => generateCsrfToken()]);
