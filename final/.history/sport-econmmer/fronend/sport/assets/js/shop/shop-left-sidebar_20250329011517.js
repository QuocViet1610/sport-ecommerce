$(document).ready(function () {
// Lấy giá trị id từ URL
function getUrlParameter(name) {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);
    return params.get(name);
}

// Lấy id từ URL
var id = getUrlParameter('id');
console.log(id); 
var requestData = {
    searchText: "",
    fullParentId: id
};

$.ajax({
    url: "http://localhost:8080/product/search?page=0&size=10", 
    type: "POST", 
    contentType: "application/json",  
    data: JSON.stringify(requestData),  
    success: function(response) {
        if (response.data && response.data.content) {
        console.log(response.data.content); 
        renderProducts(response.data.content);
        }
    },
    error: function(xhr, status, error) {
        console.error("Đã có lỗi xảy ra: " + error);
    }


});
});

function renderProducts(products) {
    var productListHtml = '';

    products.forEach(function(product) {
        // Tìm hình ảnh có isPrimary = 1
        var primaryImage = product.productImages.find(image => image.isPrimary === 1);
        var imageUrl = primaryImage ? primaryImage.imageUrl : ''; // Nếu không tìm thấy, để trống

        var productHtml = `
            <div class="col">
                <div class="product-box-3 h-100 wow fadeInUp">
                    <div class="product-header">
                        <div class="product-image">
                            <a href="product-left-thumbnail.html">
                                <!-- Hiển thị hình ảnh chính -->
                                <img src="${imageUrl}" class="img-fluid blur-up lazyload" alt="">
                            </a>

                            <ul class="product-option">
                                <li data-bs-toggle="tooltip" data-bs-placement="top" title="Xem nhanh">
                                    <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#view">
                                        <i data-feather="eye"></i>
                                    </a>
                                </li>

                                <li data-bs-toggle="tooltip" data-bs-placement="top" title="yêu thích">
                                    <a href="wishlist.html" class="notifi-wishlist">
                                  
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="product-footer">
                        <div class="product-detail">
                            <span class="span-name">${product.brandName || ''}</span>

                            <a href="product-left-thumbnail.html">
                                <h5 class="name">${product.productName}</h5>
                            </a>
                            <h5 class="price">
                                <span class="theme-color">${product.productPrice.toLocaleString()}đ</span>
                                <del>${product.productPrice.toLocaleString()}đ</del>
                            </h5>
                            <div class="product-rating mt-2">
                                <ul class="rating">
                                    <li><i data-feather="star" class="fill"></i></li>
                                </ul>
                                <span>${product.productTotalRating}</span>
                         
                            </div>
                            <div class="add-to-cart-box bg-white">
                                <button class="btn btn-add-cart addcart-button">Thêm
                                    <span class="add-icon bg-light-gray">
                                        <i class="fa-solid fa-plus"></i>
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
               // <span>${product.productTotalRating}</span>
        productListHtml += productHtml;
    });

    // Thêm các sản phẩm vào phần tử có id 'product-list'
    document.getElementById('product-list').innerHTML = productListHtml;

    // Khởi tạo Feather Icons
    feather.replace();

    // Khởi tạo Bootstrap Tooltip
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}


