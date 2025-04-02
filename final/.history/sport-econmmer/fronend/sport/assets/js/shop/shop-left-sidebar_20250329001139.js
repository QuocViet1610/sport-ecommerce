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
        renderProducts(productData.data.content);
    },
    error: function(xhr, status, error) {
        console.error("Đã có lỗi xảy ra: " + error);
    }


});
});

// Giả sử bạn đã có dữ liệu sản phẩm từ API (dữ liệu JSON)
var productData = {
    "data": {
        "content": [
            {
                "productId": 45,
                "productCode": "GC00045",
                "productName": "Giày chạy bộ nữ đế carbon - KD900X.2 xanh lá/tím",
                "productPrice": 3399000.0,
                "productDescription": null,
                "productIsActive": true,
                "productTotalSold": 0,
                "productTotalRating": 4.0,
                "productStock": 10,
                "productDiscountPrice": 0.0,
                "createdAt": "2025-03-28T09:41:32Z",
                "updatedAt": "2025-03-28T09:41:32Z",
                "categoryName": "Giày chạy bộ nữ",
                "productVariants": [
                    { "name": "Giày chạy bộ nữ đế carbon - KD900X.2 xanh lá/tím-41", "price": 3399000.00 },
                    { "name": "Giày chạy bộ nữ đế carbon - KD900X.2 xanh lá/tím-38", "price": 3399000.00 }
                ],
                "productImages": [
                    { "imageUrl": "http://localhost:9000/sports/product/1743154892057_giay-chay-bo-nu-de-carbon-kd900x-2-xanh-la-tim-kiprun-8915932_(2).avif" }
                ],
                "productAttributeValue": [
                    { "name": "42" }, { "name": "38" }, { "name": "39" }
                ]
            },
            {
                "productId": 44,
                "productCode": "GC00044",
                "productName": "Giày chạy bộ Run One cho nữ",
                "productPrice": 299000.0,
                "productDescription": "<p><strong>Giày chạy bộ này với đế xốp...</strong></p>",
                "productIsActive": true,
                "productTotalSold": 0,
                "productTotalRating": 4.5,
                "productStock": 20,
                "productDiscountPrice": 0.0,
                "createdAt": "2025-03-28T09:37:14Z",
                "updatedAt": "2025-03-28T09:37:14Z",
                "categoryName": "Giày chạy bộ nữ",
                "productVariants": [
                    { "name": "Giày chạy bộ Run One cho nữ -42", "price": 299000.00 },
                    { "name": "Giày chạy bộ Run One cho nữ -40", "price": 299000.00 }
                ],
                "productImages": [
                    { "imageUrl": "http://localhost:9000/sports/product/1743154634194_giay-chay-bo-nu-jf-190-grip-xam-hong-kalenji-8913975_(1).avif" }
                ],
                "productAttributeValue": [
                    { "name": "42" }, { "name": "40" }, { "name": "39" }
                ]
            }
        ]
    }
};

// Chức năng để render từng sản phẩm
function renderProducts(products) {
    var productListHtml = '';
    
    products.forEach(function(product) {
        var productHtml = `
            <div class="product-box-3 h-100 wow fadeInUp">
                <div class="product-header">
                    <div class="product-image">
                        <a href="product-left-thumbnail.html">
                            <img src="${product.productImages[0].imageUrl}" class="img-fluid blur-up lazyload" alt="">
                        </a>
                    </div>
                </div>
                <div class="product-footer">
                    <div class="product-detail">
                        <span class="span-name">Thương hiệu</span>
                        <a href="product-left-thumbnail.html">
                            <h5 class="name">${product.productName}</h5>
                        </a>
                        <p class="text-content mt-1 mb-2 product-content">${product.productDescription || 'Không có mô tả'}</p>
                        <h5 class="price"><span class="theme-color">${product.productPrice.toLocaleString()}đ</span> <del>${product.productCostPrice.toLocaleString()}đ</del></h5>
                        <div class="product-rating mt-2">
                            <ul class="rating">
                                <li>
                                    <i data-feather="star" class="fill"></i>
                                </li>
                            </ul>
                            <span>${product.productTotalRating}</span>
                            <span>(${product.productTotalSold} đã bán)</span>
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



