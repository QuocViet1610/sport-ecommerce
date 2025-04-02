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




$(document).ready(function() {
 
    let token = localStorage.getItem('authToken');
    if (!token) {
        showError("Bạn chưa đăng nhập");
        return; 
    }
    fetchAddresses()
    function fetchAddresses(){
    $.ajax({
        url: "http://localhost:8080/addresses", 
        type: "GET",
        headers: {
            'Authorization': 'Bearer ' + token 
        },
        success: function(response) {
            if (response.code === "200") {

                displayAddresses(response.data);
            } else {
                showError("Không lấy được dữ liệu địa chỉ");
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = "Lỗi hệ thống xin vui lòng liên hệ quản trị viên"; 

            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message; 
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText; 
            }
        
            showError(errorMessage);
        }
    });
}
  
    function displayAddresses(addresses) {
        // Đầu tiên xóa tất cả các phần tử cũ trong #addressList
        $("#addressList").empty();
    
        // Lặp qua danh sách địa chỉ và tạo HTML cho mỗi địa chỉ
        addresses.forEach(function(address) {
            var addressHtml = `
                <div class="col-xxl-6 col-lg-12 col-md-6" id = "${address.id}">
                    <div class="delivery-address-box">
                        <div>
                                                <div class="form-check">
                        <input class="form-check-input" 
                               id="addressDefault" 
                               type="radio" 
                               name="jack" 
                               ${address.isDefault === 1 ? 'checked' : ''} 
                               data-ward-id="${address.wardId}"
                               data-district-id="${address.districtId}"
                               data-province-id="${address.provinceId}">
                    </div>
                                     ${address.isDefault === 1 ? '<div class="label"><label>Mặc định</label></div>' : ''}

                            <ul class="delivery-address-detail">
                                <li>
                                    <h4 class="fw-500" >${address.fullName}</h4>
                                </li>
                                <li>
                                   <p class="text-content" 
                                    data-ward-id="${address.wardId}" 
                                    data-district-id="${address.districtId}" 
                                    data-province-id="${address.provinceId}">
                                        <span class="text-title">Địa chỉ: </span>${address.addressText}, ${address.wardName}, ${address.districtName}, ${address.provinceName}
                                    </p>
                                </li>
                                <li>
                                    <h6 class="text-content mb-0"><span class="text-title">Số điện thoại: </span>${address.phoneNumber}</h6>
                                </li>
                                <li>
                                    <div class="action-buttons" style="display: flex; justify-content: flex-end;">
                                        <!-- Button Chỉnh sửa -->
                                        <button class="btn edit-btn" style="padding:0px; padding-right:20px; color:var(--theme-color);">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <!-- Button Xóa -->
                                        <button class="btn delete-btn" style="padding:0px; color:red;">
                                            <i class="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            // Thêm mỗi địa chỉ vào phần tử HTML với id "addressList"
            $("#addressList").append(addressHtml);
        });
    
        // Thêm nút "Thêm địa chỉ mới" vào cuối danh sách
        var addNewAddressButton = `
            <div class="col-xxl-6 col-lg-12 col-md-6">
                <div class="delivery-address-box">
                    <button id="openModalBtnAddress" class="btn" style="width: 100%; padding: 15px; text-align: center; font-size: 18px; cursor: pointer;">
                        <span style="font-size: 30px;">+</span> Thêm địa chỉ mới
                    </button>
                </div>
            </div>
        `;
        // Thêm nút vào cuối danh sách
        $("#addressList").append(addNewAddressButton);
        $('input[type="radio"][name="jack"]:checked').each(function() {
            displaySelectedAddress($(this)); 
        });
        
    }

   // Modal mở và đóng
    var modal = document.getElementById("addressModal");
    var span = document.getElementsByClassName("close")[0];


    $(document).on('click', '#openModalBtnAddress', function() {
        modal.style.display = "block";
    });

    // Khi người dùng nhấn vào "×", modal sẽ đóng
    span.onclick = function() {
        modal.style.display = "none";
    }

  
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

//*********** luu đja chỉ  */
$("#addressForm").submit(function(event) {
    event.preventDefault(); 

    var formData = {
        userId: 1,
        fullName: $("#fullName").val(),
        phoneNumber: $("#phone").val(),
        

        provinceName: $("#city option:selected").text(),

        provinceId: $("#city").val(),
        
        districtName: $("#district option:selected").text(),

        districtId: $("#district").val(),

        wardName: $("#ward option:selected").text(),

        wardId: $("#ward").val(),
        
        country: "Việt Nam",
        isDefault: $("#acceptTerms").is(":checked") ? 1 : 0,
        note: $("#notes").val(),
        addressText: $("#deliveryAddress").val()
    };
    
    console.log(formData)
    let token = localStorage.getItem('authToken');
    if (!token) {
        showError("Bạn chưa đăng nhập");
        return; 
    }
    $.ajax({
        url: "http://localhost:8080/addresses",  
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(formData),  
        headers: {
            'Authorization': 'Bearer ' + token 
        },
        success: function(response) {
            showSuccess("Địa chỉ đã được thêm thành công!");
            $("#addressModal").hide();  // Đóng modal khi thành công
            fetchAddresses()
            resetModal() 
            renderPlace()
        },
        error: function(xhr, status, error) {
            let errorMessage = "Đã có lỗi xảy ra khi thêm địa chỉ."; 

            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message; 
            } else if (xhr.responseText) {
                errorMessage = xhr.responseText; 
            }
        
            showError(errorMessage);
        }
    });
});
function resetModal() {
    $("#fullName").val("");
    $("#phone").val("");
    $("#deliveryAddress").val("");
    $("#notes").val("");
    $("#addressType").val("");
}
//xoa**********************
$(document).on('click', '.delete-btn', function() {

    var addressId = $(this).closest('div[id]').attr('id');
    


        $.ajax({
            url: `http://localhost:8080/addresses/remove/${addressId}`,
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken') 
            },
            success: function(response) {
                // Xóa địa chỉ khỏi DOM sau khi xóa thành công
                $("#" + addressId).remove();
                showSuccess("Địa chỉ đã được xóa thành công!");
            },
            error: function(xhr, status, error) {
                let errorMessage = "Đã có lỗi xảy ra khi xóa địa chỉ.";
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                showError(errorMessage); // Hiển thị thông báo lỗi
            }
        });
    
});
//**************Chon dia chi mac dinh**************** */
$(document).on('change', 'input[type="radio"][name="jack"]', function() {
    displaySelectedAddress($(this));
});


$.ajax({
    url: 'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
    method: 'POST',
    headers: {
        'Token': 'b01fb787-0c89-11f0-8e8f-aecf0e98035f',
        'shop_id': '5708578'
    },
    contentType: 'application/json',
    data: JSON.stringify({
        "service_type_id": 2,
        "from_district_id": 1542,
        "from_ward_code": "1B1515",
        "to_district_id": districtId,  // Đảm bảo giá trị hợp lệ
        "to_ward_code": wardId,        // Đảm bảo giá trị hợp lệ
        "length": 2,
        "width": 2,
        "height": 12,
        "weight": 5000,                // Đảm bảo trọng lượng hợp lệ và không bằng 0
        "insurance_value": 0,
        "coupon": null,
        "items": [
            {
                "name": "sản phẩm",
                "quantity": 1,
                "length": 200,
                "width": 200,
                "height": 200,
                "weight": 1000
            }
        ]
    }),
    success: function(response) {
        console.log("Phí vận chuyển nhận được:", response);
    },
    error: function(xhr, status, error) {
        console.error("Đã xảy ra lỗi khi gọi API:", error);
        console.error("Chi tiết lỗi:", xhr.responseText); // Thêm chi tiết lỗi để xem thông báo đầy đủ
    }
});



});
