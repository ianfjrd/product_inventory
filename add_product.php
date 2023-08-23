<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $connection = new mysqli("localhost", "root", "", "product_management");

    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }

    $productName = $_POST["productName"];
    $unit = $_POST["unit"];
    $price = $_POST["price"];
    $expiryDate = $_POST["expiryDate"];
    $inventory = $_POST["inventory"];

    $targetDir = "uploads/";
    $targetFile = $targetDir . basename($_FILES["productImage"]["name"]);
    move_uploaded_file($_FILES["productImage"]["tmp_name"], $targetFile);

    $sql = "INSERT INTO products (productName, unit, price, expiryDate, inventory, productImage) 
            VALUES ('$productName', '$unit', '$price', '$expiryDate', '$inventory', '$targetFile')";
    
    if ($connection->query($sql) === TRUE) {
        echo "Product added successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $connection->error;
    }

    $connection->close();
}
?>
