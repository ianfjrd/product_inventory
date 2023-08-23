<?php
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST["productId"])) {
    $connection = new mysqli("localhost", "root", "", "product_management");

    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }

    $productId = $_POST["productId"];

    $sql = "DELETE FROM products WHERE id = $productId";

    if ($connection->query($sql) === TRUE) {
        echo "Product deleted successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $connection->error;
    }

    $connection->close();
}
?>
