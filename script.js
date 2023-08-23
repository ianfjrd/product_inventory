document.getElementById("productForm").addEventListener("submit", function (event) {
    
    const productName = document.getElementById("productName").value;
    const unit = document.getElementById("unit").value;
    const price = document.getElementById("price").value;
    const expiryDate = document.getElementById("expiryDate").value;
    const inventory = document.getElementById("inventory").value;
    const productImage = document.getElementById("productImage").files[0];
    const formData = new FormData();

    formData.append("productName", productName);
    formData.append("unit", unit);
    formData.append("price", price);
    formData.append("expiryDate", expiryDate);
    formData.append("inventory", inventory);
    formData.append("productImage", productImage);

    //AJAX
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "add_product.php", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText);
        } else {
            console.error("Error adding product");
        }
    };
    xhr.send(formData);
});

function populateProductList() {
    const productTableBody = document.getElementById("productTableBody");
    productTableBody.innerHTML = "";

    //AJAX request to fetch
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "get_products.php", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const products = JSON.parse(xhr.responseText);

            products.forEach(product => {
                const inventoryCost = (product.inventory * product.price).toFixed(2); // Calculate inventory cost
                const row = `
                    <tr>
                        <td>${product.productName}</td>
                        <td>${product.unit}</td>
                        <td>${product.price}</td>
                        <td>${product.expiryDate}</td>
                        <td>${product.inventory}</td>
                        <td>${inventoryCost}</td>
                        <td><img src="${product.productImage}" alt="Product Image" width="50"></td>
                        <td>
                            <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                        </td>
                    </tr>`;
                productTableBody.innerHTML += row;
            });
        } else {
            console.error("Error fetching products");
        }
    };
    xhr.send();
}

let selectedProductId = null;

function populateEditModal(product) {
    selectedProductId = product.id;
    document.getElementById("editProductId").value = product.id;
    document.getElementById("editProductName").value = product.productName;
    document.getElementById("editUnit").value = product.unit;
    document.getElementById("editPrice").value = product.price;
    document.getElementById("editExpiryDate").value = product.expiryDate;
    document.getElementById("editInventory").value = product.inventory;
    
    // Set image
    const imagePreview = document.getElementById("editImagePreview");
    imagePreview.src = product.productImage;
}


//modal for editing
function editProduct(productId) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `get_product.php?id=${productId}`, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            const product = JSON.parse(xhr.responseText);
            populateEditModal(product);
            $("#editModal").modal("show");
        } else {
            console.error("Error fetching product");
        }
    };
    xhr.send();
}

document.getElementById("saveChanges").addEventListener("click", function () {
    const editProductId = document.getElementById("editProductId").value;
    const editProductName = document.getElementById("editProductName").value;
    const editUnit = document.getElementById("editUnit").value;
    const editPrice = document.getElementById("editPrice").value;
    const editExpiryDate = document.getElementById("editExpiryDate").value;
    const editInventory = document.getElementById("editInventory").value;

    const formData = new FormData();
    formData.append("id", editProductId);
    formData.append("productName", editProductName);
    formData.append("unit", editUnit);
    formData.append("price", editPrice);
    formData.append("expiryDate", editExpiryDate);
    formData.append("inventory", editInventory);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "update_product.php", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            $("#editModal").modal("hide");
            populateProductList();
        } else {
            console.error("Error updating product");
        }
    };
    xhr.send(formData);
});

function saveChanges() {
    const editProductName = document.getElementById("editProductName").value;
    const editUnit = document.getElementById("editUnit").value;
    const editPrice = document.getElementById("editPrice").value;
    const editExpiryDate = document.getElementById("editExpiryDate").value;
    const editInventory = document.getElementById("editInventory").value;
    const editProductImage = document.getElementById("editProductImage").files[0];

    const formData = new FormData();
    formData.append("editProductId", selectedProductId);
    formData.append("editProductName", editProductName);
    formData.append("editUnit", editUnit);
    formData.append("editPrice", editPrice);
    formData.append("editExpiryDate", editExpiryDate);
    formData.append("editInventory", editInventory);

    if (editProductImage) {
        formData.append("editProductImage", editProductImage);
    }

    //AJAX request to save
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "save_changes.php", true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            // Reload the page after saving
            location.reload();
        } else {
            console.error("Error saving changes");
        }
    };
    xhr.send(formData);
}

document.getElementById("saveChanges").addEventListener("click", saveChanges);

function deleteProduct(productId) {
    const confirmed = confirm("Are you sure you want to delete this product?");
    if (confirmed) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", "delete_product.php", true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.onload = function () {
            if (xhr.status === 200) {
                location.reload();
            } else {
                console.error("Error deleting product");
            }
        };
        xhr.send(`productId=${productId}`);
    }
}

//load data when the page loads
populateProductList();