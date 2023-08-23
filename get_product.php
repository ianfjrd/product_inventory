<?php
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["id"])) {
    $connection = new mysqli("localhost", "root", "", "product_management");

    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }

    $productId = $_GET["id"];

    $sql = "SELECT * FROM products WHERE id = $productId";
    $result = $connection->query($sql);

    if ($result->num_rows === 1) {
        $product = $result->fetch_assoc();
        echo json_encode($product);
    } else {
        echo "Product not found";
    }

    $connection->close();
}
?>
