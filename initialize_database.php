<?php
require 'config.php';

$link = new mysqli($host_name, $user_name, $password, $database);

if ($link->connect_error) {
    die('Failed to connect to MySQL: ' . $link->connect_error);
}

$initial_tickers = array(
    array('ticker' => 'WEEZ', 'price' => 12.50),
    array('ticker' => 'BNYS', 'price' => 4.34),
    array('ticker' => 'PDMS', 'price' => 6.23),
    array('ticker' => 'WNDO', 'price' => 14.43),
    array('ticker' => 'CLKN', 'price' => 8.18),
    array('ticker' => 'HGNS', 'price' => 5.12),
    array('ticker' => 'LSIA', 'price' => 11.18),
    array('ticker' => 'RAVN', 'price' => 5.23),
    array('ticker' => 'AMMU', 'price' => 16.65),
);

foreach ($initial_tickers as $ticker_data) {
    $ticker = $ticker_data['ticker'];
    $price = $ticker_data['price'];
    $timestamp = time();

    $query = "INSERT INTO stock_latest (ticker, price, timestamp) VALUES (?, ?, ?)";
    $stmt = $link->prepare($query);
    $stmt->bind_param("sdi", $ticker, $price, $timestamp);

    if (!$stmt->execute()) {
        echo "Error inserting ticker {$ticker}: " . $stmt->error . "\n";
    } else {
        echo "Inserted {$ticker} with initial price {$price}\n";
    }
}

$stmt->close();
$link->close();
?>
