$(document).ready(function() {
    // Lấy Token từ Local Storage
    let token = localStorage.getItem("authToken");

    // Kiểm tra nếu không có Token, thông báo và dừng API call
    if (!token) {
        showError("Bạn chưa đăng nhập!");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/product", // Thay {{local}} bằng URL thực tế
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token, // Chèn Token vào Header
            "Accept": "application/json"
        },
        success: function(response) {
            if (response.code === "200") {
                let products = response.data;
                let tableBody = $("#product-list");

                products.forEach(product => {
                    let images = product.productImages.map(img => 
                        `<img src="${img.imageUrl}" width="50" height="50">`
                    ).join(" ");

                    let attributes = product.productAttributeValue.map(attr => 
                        `<b>${attr.attributeName}:</b> ${attr.attributeValues.map(av => av.name).join(", ")}`
                    ).join("<br>");

                    tableBody.append(`
                        <tr>
                            <td>${product.productId}</td>
                            <td>${product.productCode}</td>
                            <td>${product.productName}</td>
                            <td>${product.productPrice.toLocaleString()} VND</td>
                            <td>${images}</td>
                            <td>${attributes}</td>
                        </tr>
                    `);
                });
            } else {
                alert("Lỗi lấy dữ liệu: " + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Lỗi xác thực! Token có thể đã hết hạn.");
        }
    });
});
