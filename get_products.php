<?php
$connection = new mysqli("localhost", "root", "", "product_management");

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

$sql = "SELECT * FROM products";
$result = $connection->query($sql);

$products = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

header("Content-Type: application/json");
echo json_encode($products);

$connection->close();
?>
