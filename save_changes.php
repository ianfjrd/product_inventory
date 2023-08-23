<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $connection = new mysqli("localhost", "root", "", "product_management");

    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }

    $editProductId = $_POST["editProductId"];
    $editProductName = $_POST["editProductName"];
    $editUnit = $_POST["editUnit"];
    $editPrice = $_POST["editPrice"];
    $editExpiryDate = $_POST["editExpiryDate"];
    $editInventory = $_POST["editInventory"];

    if (!empty($_FILES["editProductImage"]["name"])) {
        $targetDir = "uploads/";
        $targetFile = $targetDir . basename($_FILES["editProductImage"]["name"]);
        move_uploaded_file($_FILES["editProductImage"]["tmp_name"], $targetFile);

        $productImage = $targetFile;
    } else {
        // Retain the old product image path
        $sql = "SELECT productImage FROM products WHERE id = $editProductId";
        $result = $connection->query($sql);
        if ($result->num_rows === 1) {
            $row = $result->fetch_assoc();
            $productImage = $row["productImage"];
        }
    }

    // Update data
    $sql = "UPDATE products 
            SET productName = '$editProductName', unit = '$editUnit', price = '$editPrice', 
                expiryDate = '$editExpiryDate', inventory = '$editInventory', productImage = '$productImage'
            WHERE id = $editProductId";

    if ($connection->query($sql) === TRUE) {
        echo "Changes saved successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $connection->error;
    }

    $connection->close();
}
?>
