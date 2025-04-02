$(document).ready(function () {
    renderCheckout();
    renderPlace();
    
});

function renderPlace(){
   
    $.ajax({
        url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        method: "GET",
        success: function(response) {
            let provinces = response.data;
            provinces.forEach(function(province) {
                $('#city').append(new Option(province.ProvinceName, province.ProvinceID));
            });
        }
    });

    // Khi chọn tỉnh thành, lấy danh sách quận huyện
    $('#city').change(function() {
        let provinceId = $(this).val();
        if (provinceId) {
            $.ajax({
                url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
                method: "GET",
                data: { province_id: provinceId },
                success: function(response) {
                    let districts = response.data;
                    $('#district').empty().append(new Option('Chọn Quận/Huyện', ''));
                    districts.forEach(function(district) {
                        $('#district').append(new Option(district.DistrictName, district.DistrictID));
                    });
                }
            });
        } else {
            $('#district').empty().append(new Option('Chọn Quận/Huyện', ''));
            $('#ward').empty().append(new Option('Chọn Phường/Xã', ''));
        }
    });

    // Khi chọn quận huyện, lấy danh sách phường xã
    $('#district').change(function() {
        let districtId = $(this).val();
        if (districtId) {
            $.ajax({
                url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/ward",
                method: "GET",
                data: { district_id: districtId },
                success: function(response) {
                    let wards = response.data;
                    $('#ward').empty().append(new Option('Chọn Phường/Xã', ''));
                    wards.forEach(function(ward) {
                        $('#ward').append(new Option(ward.WardName, ward.WardCode));
                    });
                }
            });
        } else {
            $('#ward').empty().append(new Option('Chọn Phường/Xã', ''));
        }
    });
}

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
    let shippingFee = 30000; // phí giao hàng
    let discount = 0; // Giảm giá (có thể thay đổi theo yêu cầu)
    let grandTotal = 0;

    cart.forEach(item => {
        let quantityProduct = item.quantity;
        item = item.productView;
        item.quantity = quantityProduct;

        let mainImage = item.productImages.find(image => image.isPrimary === 1);
        let imageUrl = mainImage ? mainImage.imageUrl : 'default-image.jpg';
        let productName = item.productName;
        let productPrice = item.productPrice;
        let quantity = item.quantity;
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

        // Tính tổng số tiền cho tất cả các sản phẩm
        totalAmount += totalPrice;

        // Tạo HTML cho mỗi sản phẩm trong giỏ hàng
        cartHTML += `
            <li>
                <img src="${imageUrl}" class="img-fluid blur-up lazyloaded checkout-image" alt="">
                <h4>${productName} <span>- x ${quantity}</span></h4>
                <h4 class="price">${totalPrice.toLocaleString()}đ</h4>
            </li>
        `;
    });

    // Tính tổng đơn hàng
    let shippingAndDiscount = shippingFee - discount;
    grandTotal = totalAmount + shippingAndDiscount;

    // Tạo phần tử tổng cộng, phí giao hàng, giảm giá và tổng đơn hàng
    let summaryHTML = `
        <ul class="summery-total">
            <li>
                <h4>Tổng cộng</h4>
                <h4 class="price">${totalAmount.toLocaleString()}đ</h4>
            </li>
            <li>
                <h4>Phí giao hàng</h4>
                <h4 class="price">${shippingFee.toLocaleString()}đ</h4>
            </li>
            <li>
                <h4>Giảm giá</h4>
                <h4 class="price">-${discount.toLocaleString()}đ</h4>
            </li>
            <li class="list-total">
                <h4>Tổng đơn hàng</h4>
                <h4 class="price">${grandTotal.toLocaleString()}đ</h4>
            </li>
        </ul>
    `;

    // Chèn các sản phẩm vào phần tóm tắt giỏ hàng
    $('.summery-contain').html(cartHTML);

    // Chèn phần tổng cộng vào
    $('.summery-total').html(summaryHTML);
}

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


// addresssssss
var modal = document.getElementById("addressModal");
var btn = document.getElementById("openModalBtnAddress");
var span = document.getElementsByClassName("close")[0];
var editAddress = document.getElementById("editAddress");
var editButton = document.getElementById("editAddress");

// Khi người dùng nhấn vào nút, modal sẽ mở
btn.onclick = function() {
    modal.style.display = "block";
}

// Khi người dùng nhấn vào "×", modal sẽ đóng
span.onclick = function() {
    modal.style.display = "none";
}

// Khi người dùng nhấn ra ngoài modal, modal sẽ đóng
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
