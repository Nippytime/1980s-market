<?php
require 'config.php';

header('Content-Type: application/json'); // Set the content type to JSON

$link = new mysqli($host_name, $user_name, $password, $database);

if ($link->connect_error) {
    http_response_code(500);
    die(json_encode(array('error' => 'Failed to connect to MySQL: ' . $link->connect_error)));
}

// Fetch stock data from the frontend
$stockData = json_decode(file_get_contents('php://input'), true);

// Begin a transaction
$link->begin_transaction();

try {
    // Update stock prices in the database
    foreach ($stockData as $stock) {
        // Insert or update the stock_latest table
        $query = "INSERT INTO stock_latest (ticker, price, timestamp) VALUES (?, ?, ?)
                  ON DUPLICATE KEY UPDATE price = VALUES(price), timestamp = VALUES(timestamp)";
        $stmt = $link->prepare($query);
        $stmt->bind_param("sdi", $stock['ticker'], $stock['price'], time());
        $stmt->execute();

        // Insert the stock price into the stock_history table
        $query = "INSERT INTO stock_history (ticker, price, timestamp) VALUES (?, ?, ?)";
        $stmt = $link->prepare($query);
        $stmt->bind_param("sdi", $stock['ticker'], $stock['price'], time());
        $stmt->execute();
    }

    // Commit the transaction
    $link->commit();
    echo json_encode(array('success' => 'Data successfully saved to both tables.'));
} catch (Exception $e) {
    // An error occurred, rollback the transaction and return an error message
    $link->rollback();
    http_response_code(500);
    echo json_encode(array('error' => 'Failed to save data: ' . $e->getMessage()));
} finally {
    // Close the connection
    $stmt->close();
    $link->close();
}
?>