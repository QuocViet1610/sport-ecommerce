$(document).ready(function () {
    renderCart()
    $(document).on('click', '.qty-left-minus', function () {
        let $input = $(this).closest('.input-group').find('.qty-input');
        let quantity = parseInt($input.val());

        if (quantity > 1) {
            quantity--;
            $input.val(quantity); 
            updateCartQuantity($input.data('product-id'), quantity);
        }
    });

    // Xử lý sự kiện tăng số lượng
    $(document).on('click', '.qty-right-plus', function () {
        let $input = $(this).closest('.input-group').find('.qty-input');
        let quantity = parseInt($input.val());

        quantity++;
        $input.val(quantity); // Cập nhật giá trị trong ô input

        // Cập nhật lại giỏ hàng trong localStorage
        updateCartQuantity($input.data('product-id'), quantity);
    });

    // Hàm cập nhật số lượng trong giỏ hàng
    function updateCartQuantity(productId, newQuantity) {
        let cart = JSON.parse(localStorage.getItem('Cart')) || [];
        

        let product = cart.find(item => item.productId === productId);
        
        if (product) {
            product.productStock = newQuantity;  // Cập nhật số lượng mới
        }

        // Lưu lại giỏ hàng vào localStorage
        localStorage.setItem('Cart', JSON.stringify(cart));
        console.log('Updated cart:', cart); // Kiểm tra giỏ hàng đã được cập nhật
    }
});

let cartHTML = '';
cart.forEach(item => {
    // Lấy hình ảnh chính của sản phẩm
    let mainImage = item.productImages.find(image => image.isPrimary === 1);
    let imageUrl = mainImage ? mainImage.imageUrl : 'default-image.jpg'; // Nếu không có hình chính, dùng hình mặc định

    // Tính tổng tiền cho từng sản phẩm
    let productName = item.productName;
    let productPrice = item.productPrice;
    let quantity = item.stock;
    let totalPrice = productPrice * quantity;  // Tính tổng cộng

    // Nếu có variant, lấy tên và giá từ variant
    if (item.productVariants && item.productVariants.length > 0) {
        let variant = item.productVariants[0]; // Lấy variant đầu tiên
        productName = variant.name;  // Lấy tên variant
        productPrice = variant.price; // Lấy giá variant
        totalPrice = productPrice * quantity;  // Tính lại tổng cộng
    }

    // Tạo HTML cho từng sản phẩm trong giỏ hàng
    cartHTML += `
        <tr class="product-box-contain">
            <td class="product-detail">
                <div class="product border-0">
                    <a href="product-left-thumbnail.html" class="product-image">
                        <img src="${imageUrl || 'default-image.jpg'}" class="img-fluid blur-up lazyload" alt="">
                    </a>
                    <div class="product-detail">
                        <ul>
                            <li class="name" style="max-width: 300px; word-wrap: break-word !important; white-space: normal;">
                                <a href="product-left-thumbnail.html" class="nameProduct">${productName}</a>
                            </li>
                            <li class="text-content"><span class="text-title">Màu sắc: </span> ${item.productVariants ? item.productVariants[0].variantAttributes[1].attributeValue.name : 'Không có'}</li>
                            <li class="text-content"><span class="text-title">Kích thước: </span> ${item.productVariants ? item.productVariants[0].variantAttributes[0].attributeValue.name : 'Không có'}</li>
                        </ul>
                    </div>
                </div>
            </td>

            <td class="price">
                <h4 class="table-title text-content">Giá</h4>
                <h5>${productPrice.toLocaleString()}đ</h5>
            </td>

            <td class="quantity">
                <h4 class="table-title text-content">Số Lượng</h4>
                <div class="quantity-price">
                    <div class="cart_qty">
                        <div class="input-group">
                            <button type="button" class="btn qty-left-minus" data-type="minus" data-field="">
                                <i class="fa fa-minus ms-0"></i>
                            </button>
                            <input class="form-control input-number qty-input" type="text" name="quantity" value="${quantity}" data-product-id="${item.productId}">
                            <button type="button" class="btn qty-right-plus" data-type="plus" data-field="">
                                <i class="fa fa-plus ms-0"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </td>

            <td class="subtotal">
                <h4 class="table-title text-content">Tổng cộng</h4>
                <h5>${totalPrice.toLocaleString()}đ</h5>
            </td>

            <td class="save-remove">
                <h4 class="table-title text-content">Hoạt động</h4>
                <i class="fa fa-trash" aria-hidden="true" style="color:var(--theme-color); margin: auto;"></i>
            </td>
        </tr>
    `;
});

// Chèn vào bảng giỏ hàng
$('.cart-table tbody').html(cartHTML);

// Gọi hàm renderCart() khi trang được tải
$(document).ready(function() {
    renderCart();
});
