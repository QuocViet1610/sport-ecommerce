$(document).ready(function () {
    function getUrlParameter(name) {
        var url = new URL(window.location.href);
        var params = new URLSearchParams(url.search);
        return params.get(name);
    }
    var productId  = getUrlParameter('id');
    console.log(productId); 
    
    $.ajax({
        url: `http://localhost:8080/product/${productId}`, 
        type: "GET",  // Sử dụng phương thức GET
        success: function(response) {


            if (response.code === "200") {
                var product = response.data;
                console.log(product)
                renderProductImages(product);
                $('#nameProduct').text(product.productName); 
                $('#Price').text(product.productPrice.toLocaleString() + "đ"); 
                $('#PriceOld').text(product.productPrice.toLocaleString() + "đ"); 
                $('#ratting').text(`${product.productTotalRating}`)
                $('#sold').text(`| đã bán ${product.productTotalSold}`)
                $('#brandName').text(product.brandName || 'Không có thương hiệu');  
                $('#productCode').text(product.productCode || 'Không có thông tin'); 
                $('#createdAt').text(new Date(product.createdAt).toLocaleDateString() || 'Không có thông tin');               
                
                if (product.productDescription) {
                    $('#product-description').html(product.productDescription);
                } else {
                    $('#product-description').html('Mô tả sản phẩm chưa có.');
                }


                var totalStock = product.productVariants.reduce(function(total, variant) {
                        return total + variant.quantity;
                }, 0);
                $('#stock').text(totalStock || 'Không có thông tin');
                renderProductAttributes(product.productAttributeValue); 
                var rating = Math.round(product.productTotalRating); 
                $('.rating li').each(function(index) {
                    if (index < rating) {
                        $(this).find('i').addClass('fill'); 
                    } else {
                        $(this).find('i').removeClass('fill'); 
                    }

                    // renderProductAttributes(product.productAttributeValue);        
                });
                            } else {
                                console.log('Không tìm thấy sản phẩm');
                            }
                        },
                        error: function(xhr, status, error) {
                            console.error("Đã có lỗi xảy ra: " + error);
                        }
                    });

});

function renderProductImages(product) {
    // Render ảnh chính (first image)
    var mainImage = product.productImages.find(image => image.isPrimary === 1); 
    if (mainImage) {
        $('#main-image').attr('src', mainImage.imageUrl);
        $('#main-image').attr('data-zoom-image', mainImage.imageUrl);
    }

    // Render ảnh phụ (sidebar images)
    var sidebarImagesHtml = '';
    product.productImages.forEach(function(image) {
        if (image.isPrimary === 0) {
            sidebarImagesHtml += `
                <div>
                    <div class="sidebar-image">
                        <img src="${image.imageUrl}" class="img-fluid blur-up lazyload" alt="">
                    </div>
                </div>
            `;
        }
    });
    $('#sidebar-images').html(sidebarImagesHtml); // Thêm ảnh phụ vào phần tử
}
// Mảng để lưu trữ các id thuộc tính đã chọn
var selectedAttributeIds = [];

function renderProductAttributes(products) {
    var attributesHtml = '';
    
    products.forEach(function(productAttributeValue) {
      
        // Tạo phần tử cho mỗi thuộc tính (Kích thước, Màu sắc, ...)
        var attributeHtml = `
            <div class="product-package" data-id="attribute-${productAttributeValue.attributeId}">
                <div class="product-title">
                    <h4>${productAttributeValue.attributeName}</h4>
                </div>
                <ul class="select-package">
                    ${productAttributeValue.attributeValues.map(function(value) {
                        return `<li><a href="javascript:void(0)" data-id="attribute-${value.id}" class="attribute-value">${value.name}</a></li>`;
                    }).join('')}
                </ul>
            </div>
        `;
        // Thêm phần tử vào container
        attributesHtml += attributeHtml;
    });

    // Chèn tất cả thuộc tính vào phần tử có id 'product-attributes'
    $('#product-attributes').html(attributesHtml);

    // Gắn sự kiện click cho các giá trị thuộc tính
    $('.attribute-value').on('click', function() {
        var $this = $(this);
        var $parentPackage = $this.closest('.product-package');
        var attributeId = $parentPackage.data('id');

        // Đặt lại màu sắc của tất cả các thuộc tính trong cùng một package về mặc định
        $parentPackage.find('.attribute-value').css('background-color', '').css('color', '');

        // Chuyển màu xanh cho giá trị đã chọn
        $this.css('background-color', 'green').css('color', 'white');

        // Lấy id của thuộc tính đã chọn
        var valueId = $this.data('id');

        // Thêm hoặc loại bỏ id thuộc tính vào mảng selectedAttributeIds
        if (selectedAttributeIds.includes(valueId)) {
            selectedAttributeIds = selectedAttributeIds.filter(function(id) {
                return id !== valueId;
            });
        } else {
            selectedAttributeIds.push(valueId);
        }

        // Hiển thị mảng id đã chọn trong console (hoặc bạn có thể gửi nó đi)
        console.log(selectedAttributeIds);
    });
}

