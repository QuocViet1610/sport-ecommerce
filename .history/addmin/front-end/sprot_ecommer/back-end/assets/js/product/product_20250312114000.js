$(document).ready(function() {
    // Lấy Token từ Local Storage
    let token = localStorage.getItem("authToken");

    // Kiểm tra nếu không có Token, thông báo và dừng API call
    if (!token) {
        showError("Bạn chưa đăng nhập!");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/product",
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function(response) {
            if (response.code === "200" && Array.isArray(response.data)) {
                // Chuyển đổi danh sách sản phẩm từ API thành danh sách đối tượng Product
                const products = response.data.map(data => new Product(data));
    
                // In ra console để kiểm tra
                console.log("Danh sách sản phẩm đã map:", products);
    
                // Xử lý logic khác (ví dụ: hiển thị danh sách sản phẩm)
                // renderProductList(products);
            } else {
                console.warn("Không có sản phẩm nào hoặc dữ liệu không hợp lệ.");
            }
        },
        error: function(xhr, status, error) {
            if (xhr.responseJSON && xhr.responseJSON.message) {
                showError(xhr.responseJSON.message); 
            } else {
                showError("Có lỗi xảy ra! Mã lỗi: " + xhr.status);
            }
        }
    });
    
});

class Product {
    constructor(data) {
        this.id = data.productId;
        this.code = data.productCode;
        this.name = data.productName;
        this.price = data.productPrice;
        this.costPrice = data.productCostPrice;
        this.description = data.productDescription;
        this.isActive = data.productIsActive;
        this.totalSold = data.productTotalSold;
        this.totalRating = data.productTotalRating;
        this.stock = data.productStock;
        this.discountPrice = data.productDiscountPrice;
        this.weight = data.productWeight;
        this.createdAt = data.productCreatedAt;
        this.updatedAt = data.productUpdatedAt;
        this.createdBy = data.productCreatedBy;
        this.updatedBy = data.productUpdatedBy;
        this.gender = {
            id: data.genderId,
            name: data.genderName
        };
        this.brand = {
            id: data.brandId,
            name: data.brandName || "Không có thương hiệu"
        };
        this.category = {
            id: data.categoryId,
            name: data.categoryName,
            image: data.categoryImage
        };
        this.variants = data.productVariants.map(variant => ({
            id: variant.id,
            code: variant.code,
            price: variant.price,
            costPrice: variant.costPrice,
            quantity: variant.quantity
        }));
        this.images = data.productImages.map(image => ({
            id: image.id,
            url: image.imageUrl,
            isPrimary: image.isPrimary
        }));
        this.attributes = data.productAttributeValue.map(attr => ({
            id: attr.attributeId,
            name: attr.attributeName,
            values: attr.attributeValues.map(value => value.name)
        }));
    }
}

$.ajax({
    url: "http://localhost:8080/product",
    method: "GET",
    dataType: "json",
    contentType: "application/json",
    headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    },
    success: function(response) {
        if (response.code === "200" && Array.isArray(response.data)) {
            // Chuyển đổi danh sách sản phẩm từ API thành danh sách đối tượng Product
            const products = response.data.map(data => new Product(data));

            // Hiển thị danh sách sản phẩm trên bảng
            renderProductTable(products);
        } else {
            console.warn("Không có sản phẩm nào hoặc dữ liệu không hợp lệ.");
        }
    },
    error: function(xhr, status, error) {
        if (xhr.responseJSON && xhr.responseJSON.message) {
            showError(xhr.responseJSON.message); 
        } else {
            showError("Có lỗi xảy ra! Mã lỗi: " + xhr.status);
        }
    }
});
