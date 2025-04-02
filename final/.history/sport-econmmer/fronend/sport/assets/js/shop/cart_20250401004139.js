$(document).ready(function () {
    renderCart();  // Render giỏ hàng khi trang được tải

    // Xử lý sự kiện xóa sản phẩm
    $(document).on('click', '.delete-product', function () {

        let $row = $(this).closest('tr'); 
        let productId = $row.find('.qty-input').data('product-id');  // Lấy productId từ ô input (sử dụng data-product-id)

        removeFromCart(productId);

        $row.remove();

        updateTotalAmount();
    });

    // Hàm xóa sản phẩm khỏi giỏ hàng
    function removeFromCart(productId) {
        let cart = JSON.parse(localStorage.getItem('Cart')) || [];

        // Tìm sản phẩm và xóa khỏi mảng giỏ hàng
        cart = cart.filter(item => item.productId !== productId);

        // Cập nhật lại giỏ hàng trong localStorage
        localStorage.setItem('Cart', JSON.stringify(cart));
        console.log('Updated cart after removal:', cart);  // Kiểm tra giỏ hàng đã được cập nhật
    }

// Khi giảm số lượng
$(document).on('click', '.qty-left-minus', function () {
    let $input = $(this).closest('.input-group').find('.qty-input'); // lấy phần tử
    let quantity = parseInt($input.val());

    if (quantity > 1) {
        quantity--;
        $input.val(quantity);  // Cập nhật giá trị trong ô inputư
   
        updateProductSubtotal($input, quantity);
    }
});

// Khi tăng số lượng
$(document).on('click', '.qty-right-plus', function () {
    let $input = $(this).closest('.input-group').find('.qty-input');
    let quantity = parseInt($input.val());

    quantity++;
    $input.val(quantity); 
    updateProductSubtotal($input, quantity);
});

// Hàm cập nhật tổng cộng của sản phẩm
function updateProductSubtotal($input, quantity) {
    let $row = $input.closest('tr'); // phan tu gan nhat
    let productPrice = parseInt($row.find('.price h5').text().replace('đ', '').replace(/\./g, '').trim());

    let productVariantId = $input.data('variant-id');
    let productId = $input.data('product-id'); 

    let totalPrice = productPrice * quantity;


    // Cập nhật giá trị trong giỏ hàng
    $row.find('.totalProduct').text(totalPrice.toLocaleString() + 'đ');

    // Cập nhật lại giỏ hàng trong localStorage
    updateCartQuantity(productId, productVariantId, quantity, totalPrice);
}


function updateCartQuantity(productId, productVariantId, quantity, totalPrice) {
    let cart = JSON.parse(localStorage.getItem('Cart')) || [];

    // Tìm sản phẩm có `productId` và `productVariantId` (nếu có)
    let product = cart.find(item => item.productId === productId && 
                                    (item.productVariants && item.productVariants[0].id === productVariantId) || 
                                    (item.productVariants.length === 0 && !productVariantId));
    console.log(product)
    if (product) {
            // Nếu không có variant, cập nhật số lượng của sản phẩm chính
            product.quantityCart = quantity;
      
    }

    // Tính lại tổng tiền giỏ hàng
    let totalAmount = 0;
    cart.forEach(item => {
        if (item.productVariants && item.productVariants.length > 0) {
            // Nếu có variant, tính tổng cho variant
            item.productVariants.forEach(variant => {
                totalAmount += variant.price * variant.quantityCart;  // Tính tổng tiền cho variant
            });
        } else {
            // Nếu không có variant, tính tổng tiền cho sản phẩm chính
            totalAmount += item.productPrice * item.quantityCart;  // Tính tổng tiền cho sản phẩm chính
        }
    });

    // Đảm bảo rằng tổng tiền giỏ hàng luôn có 3 chữ số thập phân
    totalAmount = totalAmount.toFixed(3); // Giữ ba chữ số thập phân

    // Lưu lại giỏ hàng vào localStorage
    localStorage.setItem('Cart', JSON.stringify(cart));

    // Cập nhật tổng tiền giỏ hàng
    displayTotalAmount(totalAmount);
}


// Hàm hiển thị tổng tiền của sản phẩm
function displayTotalAmount(totalAmount) {
    $('#totalProduct').text(totalAmount.toLocaleString() + "đ");
}


});

function displayTotalAmount() {

    $('#totalProduct').text(totalAmount.toLocaleString() + "đ");
}

// Hàm render giỏ hàng
function renderCart() {
    let cart = JSON.parse(localStorage.getItem('Cart')) || [];

    if (cart.length > 0) {
        let cartHTML = ''; 
        cart.forEach(item => {
            let mainImage = item.productImages.find(image => image.isPrimary === 1);
            let imageUrl = mainImage ? mainImage.imageUrl : 'default-image.jpg';
            let productName = item.productName;
            let productPrice = item.productPrice;
            let quantity = item.quantityCart;  // Lấy số lượng từ `quantityCart`, không phải `productStock`
            let totalPrice = productPrice * quantity;  // Tính tổng cộng cho sản phẩm chính
            let productVariantId = null;

            if (item.productVariants && item.productVariants.length > 0) {
                let variant = item.productVariants[0]; // Lấy variant đầu tiên (hoặc thay đổi logic nếu cần)
                productName = variant.name;  // Lấy tên variant
                productPrice = variant.price; // Lấy giá variant
                productVariantId = variant.id; // Lấy id của variant
                totalPrice = productPrice * quantity;  // Tính lại tổng cộng cho variant
            }

            let attributesHTML = renderProductAttributes(item);

            // Tạo HTML cho mỗi sản phẩm
            cartHTML += `
                <tr class="product-box-contain">
                    <td class="product-detail">
                        <div class="product border-0">
                            <a href="product-left-thumbnail.html" class="product-image">
                                <img src="${imageUrl}" class="img-fluid blur-up lazyload" alt="">
                            </a>
                            <div class="product-detail">
                                <ul>
                                    <li class="name" style="max-width: 300px; word-wrap: break-word !important; white-space: normal;">
                                        <a href="product-left-thumbnail.html" class="nameProduct">${productName}</a>
                                    </li>
                                   ${attributesHTML}  
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
                                    <input class="form-control input-number qty-input" type="text" name="quantity" value="${item.quantityCart}" data-product-id="${item.productId}" data-variant-id="${productVariantId}" readonly>
                                    <button type="button" class="btn qty-right-plus" data-type="plus" data-field="">
                                        <i class="fa fa-plus ms-0"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </td>

                    <td class="subtotal">
                        <h4 class="table-title text-content">Tổng cộng</h4>
                        <h5 class="totalProduct">${totalPrice.toLocaleString()}đ</h5>
                    </td>

                    <td class="save-remove">
                        <h4 class="table-title text-content">Hoạt động</h4>
                        <i class="fa fa-trash delete-product" aria-hidden="true" style="color:var(--theme-color); margin: auto;"></i>
                    </td>

                </tr>
            `;
        });

        // Chèn các sản phẩm vào bảng giỏ hàng
        $('.cart-table tbody').html(cartHTML);
    } else {
        // Nếu giỏ hàng trống
        console.log("Giỏ hàng trống.");
    }
}



function renderProductAttributes(product) {
    // Tạo HTML cho thông tin thuộc tính
    let attributesHTML = '';

    // Duyệt qua mảng productVariants để lấy các thuộc tính
    product.productVariants.forEach(variant => {
        variant.variantAttributes.forEach(attribute => {
            // Lấy tên thuộc tính và giá trị của thuộc tính
            let attributeName = attribute.attributeValue.attribute.name;
            let attributeValue = attribute.attributeValue.name;

            // Tạo HTML cho mỗi thuộc tính
            attributesHTML += `
                <li class="text-content">
                    <span class="text-title">${attributeName}: </span> ${attributeValue}
                </li>
            `;
        });
    });

    return attributesHTML; // Trả về các thuộc tính HTML để chèn vào giỏ hàng
}

function calculateTotalCart() {
    console.log("Aaa")
    let cart = JSON.parse(localStorage.getItem('Cart')) || []; // Lấy giỏ hàng từ localStorage
    let totalAmount = 0;

    // Duyệt qua từng sản phẩm trong giỏ hàng và cộng tổng tiền
    cart.forEach(item => {
        let productPrice = item.productPrice;
        let quantity = item.quantityCart;
        let totalPrice = productPrice * quantity; // Tính tổng tiền của sản phẩm

        // Nếu có variant, sử dụng giá variant
        if (item.productVariants && item.productVariants.length > 0) {
            let variant = item.productVariants[0]; // Giả sử lấy variant đầu tiên
            totalPrice = variant.price * quantity; // Tính lại tổng tiền cho variant
        }

        totalAmount += totalPrice; 
    });

    // In ra tổng tiền
    console.log(`Tổng cộng giỏ hàng: ${totalAmount.toLocaleString()}đ`);

    // Hiển thị tổng tiền giỏ hàng lên trang (nếu có phần tử HTML để hiển thị)
    document.getElementById("total-cart-amount").innerHTML = totalAmount.toLocaleString() + 'đ';
}
$(document).ready(function () {
    calculateTotalCart()
});