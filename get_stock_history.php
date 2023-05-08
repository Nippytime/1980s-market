<?php
require 'config.php';

header('Content-Type: application/json');

$link = new mysqli($host_name, $user_name, $password, $database);

if ($link->connect_error) {
    http_response_code(500);
    die(json_encode(array('error' => 'Failed to connect to MySQL: ' . $link->connect_error)));
}

// Get the ticker symbol from the request body
$input = json_decode(file_get_contents('php://input'), true);
$ticker = $input['ticker'];

// Prepare and execute the SQL query to fetch historical data for the given ticker
$sql = "SELECT ticker, price, timestamp FROM stock_history WHERE ticker = ?";
$stmt = $link->prepare($sql);
$stmt->bind_param("s", $ticker);
$stmt->execute();

$result = $stmt->get_result();

// Fetch the data and store it in an array
$stockHistory = array();

while ($row = $result->fetch_assoc()) {
  $stockHistory[] = $row;
}

// Close the connection
$stmt->close();
$link->close();

// Return the stock history data as JSON
echo json_encode($stockHistory);
?>
