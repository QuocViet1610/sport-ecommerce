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
                const products = response.data.map(data => new Product(data));
    

                console.log("Danh sách sản phẩm đã map:", products);
    
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

function renderProductTable(products) {
    let tbody = $(".product-group");
    tbody.empty(); // Xóa dữ liệu cũ trước khi thêm mới

    products.forEach(product => {
        let mainImage = product.images.length > 0 ? product.images[0].url : "assets/images/product/default.png";

        // Bọc toàn bộ nhóm trong `wrapper-row`
        let wrapperRow = `<tr class="wrapper-row" data-id="${product.id}">`;

        // Dòng sản phẩm chính (cha)
        wrapperRow += `
            <tr class="product-row parent-row" data-id="${product.id}">
                <td>
                    <div class="table-image">
                        <img src="${mainImage}" class="img-fluid" alt="${product.name}">
                    </div>
                </td>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.category.name}</td>
                <td>${product.stock}</td>
                <td>${product.price}đ</td>
                <td>${product.costPrice}đ</td>
                <td>
                    <ul>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#productDetailModal">
                            <i class="ri-eye-line"></i>
                        </a>
                        <li><a href="#"><i class="ri-pencil-line"></i></a></li>
                        <li><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">
                            <i class="ri-delete-bin-line"></i>
                        </li>
                    </ul>
                </td>
            </tr>
        `;

        // Nếu sản phẩm có biến thể, thêm các dòng con
        if (product.variants.length > 0) {
            product.variants.forEach(variant => {
                wrapperRow += `
                    <tr class="product-variants child-row" data-parent="${product.id}" style="display: none;">
                        <td colspan="8">
                            <div class="variant-container">
                                <table class="variant-table">
                                    <tr>
                                        <td>
                                            <div class="table-image">
                                                <img src="${mainImage}" class="img-fluid" alt="${variant.code}">
                                            </div>
                                        </td>
                                        <td>${variant.code}</td>
                                        <td>${product.name} - ${variant.code}</td>
                                        <td>${product.category.name}</td>
                                        <td>${variant.quantity}</td>
                                        <td>${variant.price}đ</td>
                                        <td>${variant.costPrice}đ</td>
                                        <td>
                                            <ul>
                                                <a href="#" data-bs-toggle="modal" data-bs-target="#productDetailModal">
                                                    <i class="ri-eye-line"></i>
                                                </a>
                                                <li><a href="#"><i class="ri-pencil-line"></i></a></li>
                                                <li><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">
                                                    <i class="ri-delete-bin-line"></i>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                `;
            });
        }

        // Đóng nhóm bao bọc
        wrapperRow += `</tr>`;

        tbody.append(wrapperRow);
    });
}


// document.addEventListener("DOMContentLoaded", function () {
//     document.querySelector("tbody.product-group").addEventListener("click", function (event) {
//         let clickedRow = event.target.closest(".parent-row");

//         if (clickedRow) {
//             let productId = clickedRow.getAttribute("data-id");
//             let variantRows = document.querySelectorAll(`.product-variants[data-parent="${productId}"]`);

//             // Kiểm tra nếu không có biến thể -> Không làm gì cả
//             if (variantRows.length === 0) {
//                 console.warn("Sản phẩm này không có biến thể.");
//                 return;
//             }

//             let isVisible = [...variantRows].some(row => row.style.display === "table-row");

//             if (isVisible) {
//                 // Nếu đang mở -> Ẩn đi và xóa border
//                 variantRows.forEach(row => row.style.display = "none");
//                 clickedRow.classList.remove("active-border");
//             } else {
//                 // Nếu đang đóng -> Hiển thị và thêm border
//                 variantRows.forEach(row => row.style.display = "table-row");
//                 clickedRow.classList.add("active-border");
//             }
//         }
//     });
// });

document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ JavaScript đã tải xong!");

    document.querySelector("tbody.product-group").addEventListener("click", function (event) {
        let clickedRow = event.target.closest(".parent-row");

        if (clickedRow) {
            console.log("🟢 Bạn đã bấm vào sản phẩm:", clickedRow);

            let productId = clickedRow.getAttribute("data-id");
            let wrapperRow = clickedRow.closest(".wrapper-row"); // Đảm bảo lấy đúng wrapper
            let variantRows = document.querySelectorAll(`.product-variants[data-parent="${productId}"]`);

            if (variantRows.length === 0) {
                return; 
            }

            let isVisible = [...variantRows].some(row => row.style.display === "table-row");

            if (isVisible) {
                console.log("🔴 Ẩn biến thể...");
                variantRows.forEach(row => row.style.display = "none");
                wrapperRow.classList.remove("active-border");
                clickedRow.classList.remove("highlight-green");
            } else {
                console.log("🟢 Hiển thị biến thể...");
                variantRows.forEach(row => row.style.display = "table-row");
                wrapperRow.classList.add("active-border");
                clickedRow.classList.add("highlight-green"); // ✅ Thêm màu xanh lá
            }
        }
    });
});
