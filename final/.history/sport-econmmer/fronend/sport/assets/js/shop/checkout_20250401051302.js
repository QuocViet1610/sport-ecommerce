$(document).ready(function () {
    renderCheckout();
});
function renderCheckout() {

    let token = localStorage.getItem('authToken');
    let cart = [];
    let decodedToken = parseJwt(token);
    let userId = decodedToken.userId; 
    if (token) {
      $.ajax({
        url: `http://localhost:8080/cart/${userId}`, 
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
            },
            success: function(data) {
                cart = data.data.cartItems;
                console.log(cart);
                displayCheckout(cart);
            },
            error: function(error) {
                console.error("Error fetching cart from API:", error);
            }
        });
    } 
}

function displayCheckout(cart) {
    let cartHTML = '';
    let totalAmount = 0;
    let shippingFee = 30000; // phí giao hàng (có thể thay đổi theo yêu cầu)
    let discount = 0; // Giảm giá (có thể thay đổi theo yêu cầu)
    
    cart.forEach(item => {
        let mainImage = item.productImages.find(image => image.isPrimary === 1);
        let imageUrl = mainImage ? mainImage.imageUrl : 'default-image.jpg';
        let productName = item.productName;
        let productPrice = item.productPrice;
        let quantity = item.quantityCart;
        let totalPrice = productPrice * quantity;
        
        let productVariantId = null;
        if (item.productVariants && item.productVariants.length > 0) {
            let variant = item.productVariants[0]; // Lấy variant đầu tiên
            productName = variant.name;
            productPrice = variant.price;
            productVariantId = variant.id;
            totalPrice = productPrice * quantity;
        }

        let attributesHTML = renderProductAttributes(item);

        // Tính tổng số tiền
        totalAmount += totalPrice;

        // Tạo HTML cho mỗi sản phẩm trong giỏ hàng
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

    // Cập nhật tổng cộng
    let shippingAndDiscount = shippingFee - discount;
    let grandTotal = totalAmount + shippingAndDiscount;

    // Chèn các sản phẩm vào bảng giỏ hàng
    $('.cart-table tbody').html(cartHTML);

    // Hiển thị tổng cộng, phí giao hàng, giảm giá và tổng đơn hàng
    $('#provisionalPrice').text(totalAmount.toLocaleString() + "đ");
    $('#shippingFee').text(shippingFee.toLocaleString() + "đ");
    $('#discount').text('-' + discount.toLocaleString() + "đ");
    $('#grandTotal').text(grandTotal.toLocaleString() + "đ");
}

// Tạo HTML cho thuộc tính sản phẩm nếu cần
function renderProductAttributes(item) {
    let attributesHTML = '';
    if (item.productAttributeValue && item.productAttributeValue.length > 0) {
        item.productAttributeValue.forEach(attribute => {
            attributesHTML += `
                <li>${attribute.attributeName}: ${attribute.attributeValues.map(val => val.name).join(', ')}</li>
            `;
        });
    }
    return attributesHTML;
}