
$(document).ready(function () {
    function isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode phần payload của JWT
            const exp = payload.exp * 1000; // Chuyển từ giây sang milliseconds
            return Date.now() >= exp; // Kiểm tra nếu token đã hết hạn
        } catch (e) {
            console.error("Token không hợp lệ:", e);
            return true; // Mặc định là hết hạn nếu có lỗi
        }
    }

    let token = localStorage.getItem("authToken");

    if (!token) {
        showError("Bạn chưa đăng nhập!");
        return;
    } else if (isTokenExpired(token)) {
        showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("authToken"); // Xóa token cũ
    }

    let currentPage = 1; // ✅ Đảm bảo luôn bắt đầu từ trang 1
    let pageSize = 10;
    let totalItems = 25;

    let searchRequest = {
        searchText: "", // Chuỗi tìm kiếm trống
        brandId: null,
        categoryId: null,
        genderId: null
    };

    let typingTimer;
    const typingDelay = 500;

    // ✅ Xử lý sự kiện nhập tìm kiếm (Live Search)
    $("#searchInput").on("input", function () {
        clearTimeout(typingTimer);
        let searchText = $(this).val().trim();
        searchRequest.searchText = searchText;

        typingTimer = setTimeout(() => {
            currentPage = 1; // ✅ Reset về trang đầu khi tìm kiếm
            fetchProducts();
        }, typingDelay);
    });

    function fetchProducts() {
        let token = localStorage.getItem("authToken");

        $.ajax({
            url: `http://localhost:8080/product/search?page=${currentPage - 1}&size=${pageSize}`,
            method: "POST",
            dataType: "json",
            data: JSON.stringify(searchRequest),
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            },
            success: function (response) {
                if (response.code === "200") {
                    let products = response.data.content.map(item => new Product(item));
                    renderProductTable(products);
                    totalItems = response.data.totalElements;
                    updatePagination();
                } else {
                    console.warn("Lỗi API:", response.message);
                }
            },
            error: function (xhr) {
                let errorMessage = xhr.responseJSON && xhr.responseJSON.message
                    ? xhr.responseJSON.message
                    : "Có lỗi xảy ra! Mã lỗi: " + xhr.status;
                showError(errorMessage);
            }
        });
    }

    // ✅ Cập nhật thông tin phân trang
    function updatePagination() {
        let totalPages = Math.ceil(totalItems / pageSize);
        let startItem = (currentPage - 1) * pageSize + 1;
        let endItem = Math.min(startItem + pageSize - 1, totalItems);

        $("#paginationInfo").text(`${startItem} - ${endItem} trong ${totalItems} hàng hóa`);
        $("#currentPageInput").val(currentPage);

        // ✅ Cập nhật trạng thái nút
        $("#firstPage, #prevPage").prop("disabled", currentPage === 1);
        $("#nextPage, #lastPage").prop("disabled", currentPage >= totalPages);
    }

    // ✅ Xử lý sự kiện thay đổi trang
    $("#firstPage").click(() => { currentPage = 1; fetchProducts(); });
    $("#prevPage").click(() => { if (currentPage > 1) currentPage--; fetchProducts(); });
    $("#nextPage").click(() => { if (currentPage < Math.ceil(totalItems / pageSize)) currentPage++; fetchProducts(); });
    $("#lastPage").click(() => { currentPage = Math.ceil(totalItems / pageSize); fetchProducts(); });

    // ✅ Xử lý khi nhập trang trực tiếp
    $("#currentPageInput").change(function () {
        let newPage = parseInt($(this).val());
        if (newPage >= 1 && newPage <= Math.ceil(totalItems / pageSize)) {
            currentPage = newPage;
            fetchProducts();
        } else {
            $(this).val(currentPage);
        }
    });

    // ✅ Xử lý khi thay đổi số dòng hiển thị
    $("#pageSizeSelect").change(function () {
        pageSize = parseInt($(this).val());
        currentPage = 1; // ✅ Reset về trang đầu
        fetchProducts();
    });

    // ✅ Gọi API lần đầu khi trang tải
    fetchProducts();


    let selectedProductId = null; // Lưu ID sản phẩm cần xóa

    // Khi bấm vào nút "Xóa", lấy ID sản phẩm và mở popup xác nhận
    $(document).on("click", ".delete-btn", function () {
        selectedProductId = $(this).data("id");
    });

    $(document).on("click", ".delete-btn", function () {
        selectedProductId = $(this).data("id"); // Lưu ID sản phẩm cần xóa
        console.log("🔴 ID sản phẩm được chọn để xóa:", selectedProductId);
    });

    // Khi nhấn "Yes" để xác nhận xóa
    $("#confirmDelete").click(function () {
        console.log("a")
        console.log("🗑 Sản phẩm đã bị xóa có ID:", selectedProductId);
    });

});




class Product {
    constructor(data) {
        this.id = data.productId || null;
        this.code = data.productCode || "";
        this.name = data.productName || "";
        this.price = data.productPrice || 0;
        this.costPrice = data.productCostPrice || 0;
        this.description = data.productDescription || "Không có mô tả";
        this.isActive = data.productIsActive || false;
        this.totalSold = data.productTotalSold || 0;
        this.totalRating = data.productTotalRating || 0.0;
        this.stock = data.productStock || 0;
        this.discountPrice = data.productDiscountPrice || 0;
        this.weight = data.productWeight || 0;
        this.createdAt = data.createdAt || "";
        this.updatedAt = data.updatedAt || "";
        this.createdBy = data.createdBy || "Không xác định";
        this.updatedBy = data.updatedBy || "Không xác định";

        this.gender = {
            id: data.genderId || null,
            name: data.genderName || "Không có giới tính"
        };

        this.brand = {
            id: data.brandId || null,
            name: data.brandName || "Không có thương hiệu"
        };

        this.category = {
            id: data.categoryId || null,
            name: data.categoryName || "Không có danh mục",
            image: data.categoryImage || ""
        };

        this.variants = Array.isArray(data.productVariants) ? 
            data.productVariants.map(variant => ({
                id: variant.id || null,
                code: variant.code || "",
                price: variant.price || 0,
                costPrice: variant.costPrice || 0,
                quantity: variant.quantity || 0
            })) : [];

        this.images = Array.isArray(data.productImages) ? 
            data.productImages.map(image => ({
                id: image.id || null,
                url: image.imageUrl || "",
                isPrimary: image.isPrimary || false
            })) : [];

        this.attributes = Array.isArray(data.productAttributeValue) ? 
            data.productAttributeValue.map(attr => ({
                id: attr.attributeId || null,
                name: attr.attributeName || "",
                values: Array.isArray(attr.attributeValues) ? 
                    attr.attributeValues.map(value => value.name || "") : []
            })) : [];
    }
}

function renderPagination(totalPages, currentPage) {
    let paginationContainer = $("#pagination");
    paginationContainer.empty(); // Xóa phân trang cũ

    for (let i = 0; i < totalPages; i++) {
        let pageItem = $(`<li class="page-item ${i === currentPage ? "active" : ""}">
                            <a class="page-link" href="#" data-page="${i}">${i + 1}</a>
                          </li>`);
        paginationContainer.append(pageItem);
    }

    // Thêm sự kiện click cho từng số trang
    $(".page-link").click(function (event) {
        event.preventDefault(); // Ngăn chặn tải lại trang
        let selectedPage = $(this).data("page");
        currentPage = selectedPage; // Cập nhật biến currentPage
        fetchProducts(currentPage); // Gọi lại API với trang mới
    });
}
const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', { minimumFractionDigits: 0 }).format(value) + ' đ';
};
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
                        <img src="${mainImage}" class="img-fluid" >
                    </div>
                </td>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.category.name}</td>
                <td>${product.stock}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${formatCurrency(product.costPrice)}</td>

                <td>
                    <ul>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#productDetailModal">
                            <i class="ri-eye-line" data-id="${product.id}"></i>
                        </a>
                        <li><a href="#"><i class="ri-pencil-line" data-id="${product.id}"></i></a></li>
                        <li><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle" ata-id="${product.id}" id="delete-btn">
                            <i class="ri-delete-bin-line"></i>
                        </li>

                    </ul>
                </td>
            </tr>
        `;
        console.log(product.variants.length)
        // Nếu sản phẩm có biến thể, thêm các dòng con
        if (product.variants.length > 0) {
            product.variants.forEach(variant => {
                wrapperRow += `
                    <tr class="product-variants child-row" data-parent="${product.id}" style="display: none; border: 1px solid #000 !important;"}>
                        <td colspan="8" style=" border: none">
                            <div class="variant-container">
                                <table class="variant-table">
                                    <tr>
                                        <td>
                                            <div class="table-image">
                                                <img src="${mainImage}" class="img-fluid"   ">
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


document.addEventListener("DOMContentLoaded", function () {

    document.querySelector("tbody.product-group").addEventListener("click", function (event) {
        let clickedRow = event.target.closest(".parent-row");

        if (clickedRow) {
            console.log("🟢 Bạn đã bấm vào sản phẩm:", clickedRow);

            let productId = clickedRow.getAttribute("data-id");
            let wrapperRow = clickedRow.closest(".parent-row");                     

            let variantRows = document.querySelectorAll(`.product-variants[data-parent="${productId}"]`);
            console.log(wrapperRow)
            console.log(variantRows)
            if (variantRows.length === 0) {
                return; 
            }

            let isVisible = [...variantRows].some(row => row.style.display === "table-row");

            if (isVisible) {
                console.log("Ẩn biến thể...");
                variantRows.forEach(row => row.style.display = "none");
                wrapperRow.classList.remove("active-border");
                clickedRow.classList.remove("highlight-green");
            } else {
                console.log("Hiển thị biến thể...");
                variantRows.forEach(row => row.style.display = "table-row");
                wrapperRow.classList.add("active-border");
                clickedRow.classList.add("highlight-green"); // ✅ Thêm màu xanh lá
            }
        }
    });
});

function renderPagination(totalPages, currentPage) {
    const pagination = $("#pagination");
    pagination.empty();
    
    for (let i = 0; i < totalPages; i++) {
        pagination.append(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="fetchProducts(${i})">${i + 1}</a>
            </li>
        `);
    }
}
