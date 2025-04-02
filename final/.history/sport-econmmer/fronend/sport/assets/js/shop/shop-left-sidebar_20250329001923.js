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
        var productHtml = `
            <div class="product-box-3 h-100 wow fadeInUp">
                <div class="product-header">
                    <div class="product-image">
                        <a href="product-left-thumbnail.html">
                            <!-- Kiểm tra nếu có hình ảnh trước khi render -->
                            
                        </a>
                    </div>
                </div>
                <div class="product-footer">
                    <div class="product-detail">
                        <span class="span-name">Thương hiệu</span>
                        <a href="product-left-thumbnail.html">
                            <h5 class="name">${product.productName || 'Tên sản phẩm không có'}</h5>
                        </a>

                        <h5 class="price">
                            <span class="theme-color">${product.productPrice.toLocaleString()}đ</span>
                            <del>${product.productCostPrice ? product.productCostPrice.toLocaleString() + 'đ' : ''}</del>
                        </h5>
                        <div class="product-rating mt-2">
                            <ul class="rating">
                                <li>
                                    <i data-feather="star" class="fill"></i>
                                </li>
                            </ul>
                            <span>${product.productTotalRating || 0}</span>
                            <span>(${product.productTotalSold || 0} đã bán)</span>
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
        `;
        productListHtml += productHtml;
    });

    // Thêm các sản phẩm vào phần tử có id 'product-list'
    document.getElementById('product-list').innerHTML = productListHtml;
}
