$(document).ready(function () {
    renderPlace();
    renderCheckout();
    
});

//dia diem
function renderPlace() {
    console.log("ssss");

    const token = "b01fb787-0c89-11f0-8e8f-aecf0e98035f";  // Token cần thêm vào header

    $.ajax({
        url: "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        method: "GET",
        headers: {
            'token': `${token}`  // Thêm token vào header
        },
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
                headers: {
                    'token': `${token}`  
                },
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
                headers: {
                    'token': `${token}`  
                },
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


// lưu địa chỉ
$(document).ready(function() {
    // Khi form được submit, gửi dữ liệu đến backend
    $("#addressForm").submit(function(event) {
        event.preventDefault(); // Ngừng hành động submit mặc định của form

        // Lấy dữ liệu từ form
        var formData = {
            userId: 1, // Giả sử ID người dùng là 1, bạn có thể lấy từ token hoặc session
            fullName: $("#fullName").val(),
            phoneNumber: $("#phone").val(),
            
            // Lấy tên của tỉnh đã chọn (text)
            provinceName: $("#city option:selected").text(),
            // Lấy ID của tỉnh đã chọn (value)
            provinceId: $("#city").val(),
            
            // Lấy tên của quận đã chọn (text)
            districtName: $("#district option:selected").text(),
            // Lấy ID của quận đã chọn (value)
            districtId: $("#district").val(),
            
            // Lấy tên của phường đã chọn (text)
            wardName: $("#ward option:selected").text(),
            // Lấy ID của phường đã chọn (value)
            wardId: $("#ward").val(),
            
            country: "Việt Nam", // Quốc gia (hoặc bạn có thể lấy từ input nếu có)
            isDefault: 1, // Đặt mặc định (hoặc từ checkbox nếu có)
            note: $("#notes").val(),
            addressText: $("#deliveryAddress").val()
        };
        
        console.log(formData)
        let token = localStorage.getItem('authToken');
        if (!token) {
            showError("Bạn chưa đăng nhập");
            return; // Dừng lại nếu không có token
        }
        $.ajax({
            url: "http://localhost:8080/addresses",  // Thay `localhost` bằng URL thực tế của bạn nếu cần
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(formData),  // Chuyển formData thành JSON
            headers: {
                'Authorization': 'Bearer ' + token  // Thêm header Authorization với token
            },
            success: function(response) {
                showSucess("Địa chỉ đã được thêm thành công!");
                $("#addressModal").hide();  // Đóng modal khi thành công
            },
            error: function(xhr, status, error) {
                let errorMessage = "Đã có lỗi xảy ra khi thêm địa chỉ."; 
    
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message; 
                } else if (xhr.responseText) {
                    errorMessage = xhr.responseText; 
                }
            
                // Hiển thị thông báo lỗi
                showError(errorMessage);
            }
        });
    });
});


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
