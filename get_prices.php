<?php
require 'config.php';

header('Content-Type: application/json');

$link = new mysqli($host_name, $user_name, $password, $database);

if ($link->connect_error) {
    http_response_code(500);
    die(json_encode(array('error' => 'Failed to connect to MySQL: ' . $link->connect_error)));
}

$query = "SELECT ticker, price FROM stock_latest";
$result = $link->query($query);

if ($result) {
    $stocks = array();
    while ($row = $result->fetch_assoc()) {
        $stocks[] = $row;
    }
    echo json_encode($stocks);
} else {
    http_response_code(500);
    die(json_encode(array('error' => 'Failed to fetch stock prices')));
}

$link->close();
?>
