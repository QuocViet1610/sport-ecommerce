document.querySelectorAll(".image-input").forEach(input => {
    input.addEventListener("change", function (event) {
        handleImageChange(event.target);
    });
});

function handleImageChange(inputElement) {
    const file = inputElement.files[0];
    const previewBox = inputElement.closest(".image-preview");
    const plusSign = previewBox.querySelector(".plus-sign");

    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewBox.innerHTML = ""; // Xóa dấu "+"

            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.display = "block";

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "×";
            removeBtn.classList.add("remove-btn");
            removeBtn.onclick = () => {
                previewBox.innerHTML = ""; // Xóa ảnh
                const newPlusSign = document.createElement("span");
                newPlusSign.classList.add("plus-sign");
                newPlusSign.textContent = "+";

                const newInput = document.createElement("input");
                newInput.type = "file";
                newInput.classList.add("image-input");
                newInput.accept = "image/*";
                newInput.addEventListener("change", function (event) {
                    handleImageChange(event.target);
                });

                previewBox.appendChild(newPlusSign);
                previewBox.appendChild(newInput);
            };

            previewBox.appendChild(img);
            previewBox.appendChild(removeBtn);
        };
        reader.readAsDataURL(file);
    }
}

const attributeList = document.getElementById("attributeList");
const addAttributeBtn = document.getElementById("addAttributeBtn");
const popup = document.getElementById("quickSelectPopup");
const closePopup = document.getElementById("closePopup");
const confirmPopup = document.getElementById("confirmPopup");
const attributeOptions = document.getElementById("attributeOptions");
const variantList = document.getElementById("variantList");

let attributes = [];
let selectedQuickAttributes = [];

document.getElementById('addAttributeBtn').addEventListener('click', function() {
    attributeCount++;
    const newAttribute = document.createElement('div');
    newAttribute.classList.add('attribute-item');
    newAttribute.innerHTML = `
        <label class="attribute-name">Thuộc tính ${attributeCount}</label>
        <button class="btn btn-primary select-attribute-btn" onclick="openPopup(${attributeCount})">Chọn giá trị</button>
    `;
    document.getElementById('attributeList').appendChild(newAttribute);
});

// thêm sản phẩm 
// $(document).ready(function () {
//     $(".custom-btn").on("click", function (e) {
//         e.preventDefault();

//         // Tạo đối tượng FormData
//         let formData = new FormData();
//         let description = document.querySelector(".ck-editor__editable").innerHTML;
//         if (description.trim() === '<p><br data-cke-filler="true"></p>') {
//             description = null;
//         }    


//         // Lấy dữ liệu từ form input
//         let productData = {
//             "name": $("#productName").val() || null,
//             "categoryId": $("#category").val() ? parseInt($("#category").val()) : null,
//             "price": $("#price").val() ? parseFloat($("#price").val()) : 0,
//             "costPrice": $("#costPrice").val() ? parseFloat($("#costPrice").val()) : 0,
//             "description": description || null,
//             "isActive": $("#isActive").length ? ($("#isActive").is(":checked") ? 1 : 0) : null,
//             "brandId": $("#brand").val() ? parseInt($("#brand").val()) || null : null,
//             "supplierId": $("#supplier").val() ? parseInt($("#supplier").val()) : null,
//             "genderId": $("#gender").val() ? parseInt($("#gender").val()) : 1,
//             "totalSold": $("#totalSold").val() ? parseInt($("#totalSold").val()) : 0,
//             "totalRating": $("#totalRating").val() ? parseFloat($("#totalRating").val()) : 0,
//             "stock": $("#stock").val() ? parseInt($("#stock").val()) : 0,
//             "discountPrice": $("#discountPrice").val() ? parseFloat($("#discountPrice").val()) : 0,
//             "weight": $("#weight").val() ? parseFloat($("#weight").val()) : null,
//             "attributeCreatRequests": []
//         };

        


//         // Lấy danh sách thuộc tính và giá trị thuộc tính
//         $(".attribute-group").each(function () {
//             let attributeId = parseInt($(this).find(".attribute-dropdown").val());
//             let attributeValues = [];
//             $(this).find(".value-container .value-tag").each(function () {
//                 attributeValues.push(parseInt($(this).attr("data-id")));
//             });

//             if (attributeId && attributeValues.length > 0) {
//                 productData.attributeCreatRequests.push({
//                     "attributeId": attributeId,
//                     "attributeValueIds": attributeValues
//                 });
//             }
//         });

//         // Lấy danh sách các biến thể sản phẩm
//         productData.productVariantCreateRequests = [];
//         $("#variantList tr").each(function () {
//             let variantAttributes = [];
//             let attributesText = $(this).find("td:first").text().split(" - ");
            
//             attributesText.forEach(attr => {
//                 let attrId = parseInt($(`.attribute-option:contains(${attr})`).attr("data-id"));
//                 if (!isNaN(attrId)) variantAttributes.push(attrId);
//             });

//             let variant = {
//                 "productId": 1, // Hoặc thay đổi nếu cần
//                 "price": parseFloat($(this).find(".sale-price").val()),
//                 "costPrice": parseFloat($(this).find(".cost-price").val()),
//                 "quantity": parseInt($(this).find(".stock-quantity").val()),
//                 "variantAttributeIds": variantAttributes
//             };

//             productData.productVariantCreateRequests.push(variant);
//         });

//         // Chuyển dữ liệu sản phẩm thành JSON và thêm vào formData
//         formData.append("data", JSON.stringify(productData));

//         // Lấy hình ảnh từ input file (tối đa 5 ảnh)
//         let imageInputs = document.querySelectorAll(".image-input");
//         let fileCount = 0;

//         imageInputs.forEach(input => {
//             if (input.files.length > 0) {
//                 formData.append("image", input.files[0]);
//                 fileCount++;
//             }
//         });


//         console.log(fileCount);
//         console.log(formData);
//         // AJAX gửi dữ liệu lên server
//         // $.ajax({
//         //     url: "https://your-api-endpoint.com/products",  // Thay bằng API backend của bạn
//         //     type: "POST",
//         //     data: formData,
//         //     processData: false,
//         //     contentType: false,
//         //     success: function (response) {
//         //         alert("Thêm sản phẩm thành công!");
//         //         console.log(response);
//         //     },
//         //     error: function (xhr, status, error) {
//         //         alert("Có lỗi xảy ra: " + error);
//         //         console.log(xhr.responseText);
//         //     }
//         // });
//     });
// });

let value = ""; 
let valueModel = ""; 
var selectedBrandValue = "";
$(document).ready(function() {
    let token = localStorage.getItem("authToken");

    if (!token) {
        showError("Bạn chưa đăng nhập!");
        return;
    }


    $('#createAttribute').on('click', function(event) {
        event.preventDefault();  

        $('#attributeModal').modal('show');  
    });
    
    $.ajax({
        url: "http://localhost:8080/brand", 
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function(data) {

            
            if(data.code == 200) {
                var dropdownMenu = $('#myDropdownBrand');
                dropdownMenu.empty();
    
                
                // Thêm input tìm kiếm
                dropdownMenu.append('<li><input type="text" class="form-control" id="myInputBrand" placeholder="Search..." onkeyup="filterFunctionBrand()"></li>');
                dropdownMenu.append('<li><a class="dropdown-item" href="#" data-name="Chọn thương hiệu" data-id="">Chọn thương hiệu</a></li>');
                // Thêm các mục vào dropdown
                $.each(data.data, function(index, item) {
                    dropdownMenu.append('<li><a class="dropdown-item" href="#" data-name="' + item.name + '" data-id="' + item.id + '">' + item.name + '</a></li>');
                });
    
                // Thêm sự kiện click cho các mục dropdown
                $('.dropdown-item').on('click', function() {
                    event.preventDefault(); 
                    var selectedBrand = $(this).data('name');
                    selectedBrandValue = $(this).data('id'); 
                    console.log(selectedBrandValue)
                    $('#dropdownButtonBrand').text(selectedBrand); 
                });
    
            } else {
                $('#myDropdownBrand').append('<li><span>Không có thương hiệu</span></li>');
            }
        },
        error: function(xhr, status, error) {
            let dropdown = $("#myDropdownBrand");
            dropdown.empty();
            dropdown.append('<div class="dropdown-item" disabled>Chưa có thương hiệu</div>');
        }
    });

    

    // Hàm để lưu ID của thương hiệu được chọn
    function selectItem(id, name) {
        // Cập nhật tên và ID vào button dropdown
        $('#dropdownButtonBrand').text(name);
        value = id; // Lưu ID vào biến value
        console.log("Thương hiệu được chọn: " + name + " (ID: " + id + ")");
    }
    
    
    

// Khai báo biến value bên ngoài AJAX
$.ajax({
    url: "http://localhost:8080/category",  
    type: "GET",
    contentType: "application/json",
    headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    },
    success: function(response) {

        console.log("Dữ liệu trả về từ API:", response);

        if(response.code == 200) {
            var categories = response.data;
            var parents = [];
            var children = {};

            console.log("Danh sách thể loại:", categories);
            categories.forEach(function(category) {
                if (category.parentId == 0) {
                    // Mục chính (parent)
                    parents.push(category);
                } else {
                    // Mục con (child)
                    if (!children[category.parentId]) {
                        children[category.parentId] = [];
                    }
                    children[category.parentId].push(category);
                }
            });

            console.log("Mục cha:", parents);
            console.log("Mục con:", children);

            function addChildrenRecursively(parentId, level) {
                if (children[parentId]) {
                    children[parentId].forEach(function(child) {
                        var childItem = $('<div>', {
                            class: 'dropdown-item',
                            html: '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(level) + child.name,
                            click: function() {
                                selectItem(child.id); 
                                $('#dropdownButton').text(child.name);
                            }
                        });


                        $('#myDropdown').append(childItem);

                        var childItemModel = $('<div>', {
                            class: 'dropdown-item',
                            html: '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(level) + child.name,
                            click: function() {
                                selectItemmModel(child.id);
                                $('#dropdownButtonModal').text(child.name);
                            }
                        });
                        // Thêm mục con vào dropdown trong modal
                        $('#myDropdownModal').append(childItemModel);

                        addChildrenRecursively(child.id, level + 1);
                    });
                }
            }


            parents.forEach(function(parent) {
                var parentItem = $('<div>', {
                    class: 'dropdown-item',
                    text: parent.name,
                    click: function() {
                        selectItem(parent.id); // Khi chọn mục cha, lưu ID vào value
                        $('#dropdownButton').text(parent.name);

                    }   
                });

                $('#myDropdown').append(parentItem);

                var parentItem = $('<div>', {
                    class: 'dropdown-item',
                    text: parent.name,
                    click: function() {
                        selectItemmModel(parent.id); 
                        $('#dropdownButtonModal').text(parent.name);
                    }   
                });
 
                $('#myDropdownModal').append(parentItem);

                addChildrenRecursively(parent.id, 1);
            });
        } else {
            alert('Lỗi: ' + response.message);
        }
    },
    error: function(xhr, status, error) {
        console.error("Lỗi khi lấy dữ liệu thể loại:", xhr.responseText || error);
        let categoryDropdown = $("#myDropdown");
        categoryDropdown.empty();
        categoryDropdown.append('<div class="dropdown-item" disabled>Không thể tải thể loại</div>');
    }
});


function selectItem(id) {
    value = id;
    console.log("ID thể loại được chọn:", value); 
}

function selectItemmModel(id) {
    valueModel = id;
    console.log("ID thể loại được chọn:", valueModel); 
}
    
    document.getElementById('category-select').addEventListener('change', function() {
    const selectedValue = this.value;
    console.log('Đã chọn thể loại:', selectedValue);
    // Có thể xử lý thêm logic khi người dùng chọn một thể loại
});



});



$(document).ready(function () {
    $(".custom-btn").on("click", function (e) {
        e.preventDefault();

        // Tạo đối tượng FormData
        let formData = new FormData();
        let description = document.querySelector(".ck-editor__editable").innerHTML;
        if (description.trim() === '<p><br data-cke-filler="true"></p>') {
            description = null;
        }    


        // Lấy dữ liệu từ form input
        let productData = {
            "name": $("#productName").val() || null,
            "categoryId": value ? parseInt(value) : null,
            "price": $("#price").val() ? parseFloat($("#price").val()) : 0,
            "costPrice": $("#costPrice").val() ? parseFloat($("#costPrice").val()) : 0,
            "description": description || null,
            "isActive": $("#isActive").length ? ($("#isActive").is(":checked") ? 1 : 0) : null,
            "brandId": selectedBrandValue ? parseInt(selectedBrandValue) || null : null,
            "supplierId": $("#supplier").val() ? parseInt($("#supplier").val()) : null,
            "genderId": $("#gender").val() ? parseInt($("#gender").val()) : 1,
            "totalSold": $("#totalSold").val() ? parseInt($("#totalSold").val()) : 0,
            "totalRating": $("#totalRating").val() ? parseFloat($("#totalRating").val()) : 0,
            "stock": $("#stock").val() ? parseInt($("#stock").val()) : 0,
            "discountPrice": $("#discountPrice").val() ? parseFloat($("#discountPrice").val()) : 0,
            "weight": $("#weight").val() ? parseFloat($("#weight").val()) : null,
            "attributeCreatRequests": []
        };

        


        // Lấy danh sách thuộc tính và giá trị thuộc tính
        $(".attribute-group").each(function () {
            let attributeId = parseInt($(this).find(".attribute-dropdown").val());
            let attributeValues = [];
            $(this).find(".value-container .value-tag").each(function () {
                attributeValues.push(parseInt($(this).attr("data-id")));
            });

            if (attributeId && attributeValues.length > 0) {
                productData.attributeCreatRequests.push({
                    "attributeId": attributeId,
                    "attributeValueIds": attributeValues
                });
            }
        });

        // Lấy danh sách các biến thể sản phẩm
        productData.productVariantCreateRequests = [];
        $("#variantList tr").each(function () {
            let variantAttributes = [];
            let attributesText = $(this).find("td:first").text().split(" - ");
            
            attributesText.forEach(attr => {
                let attrId = parseInt($(`.attribute-option:contains(${attr})`).attr("data-id"));
                if (!isNaN(attrId)) variantAttributes.push(attrId);
            });

            let variant = {
                "productId": 1, // Hoặc thay đổi nếu cần
                "price": parseFloat($(this).find(".sale-price").val()),
                "costPrice": parseFloat($(this).find(".cost-price").val()),
                "quantity": parseInt($(this).find(".stock-quantity").val()),
                "variantAttributeIds": variantAttributes
            };

            productData.productVariantCreateRequests.push(variant);
        });

        // Chuyển dữ liệu sản phẩm thành JSON và thêm vào formData
        formData.append("data", JSON.stringify(productData));

        // Lấy hình ảnh từ input file (tối đa 5 ảnh)
        let imageInputs = document.querySelectorAll(".image-input");
        let fileCount = 0;

        imageInputs.forEach(input => {
            if (input.files.length > 0) {
                formData.append("image", input.files[0]);
                fileCount++;
            }
        });


        console.log(fileCount);
        console.log(productData);
        // AJAX gửi dữ liệu lên server
        // $.ajax({
        //     url: "https://your-api-endpoint.com/products",  // Thay bằng API backend của bạn
        //     type: "POST",
        //     data: formData,
        //     processData: false,
        //     contentType: false,
        //     success: function (response) {
        //         alert("Thêm sản phẩm thành công!");
        //         console.log(response);
        //     },
        //     error: function (xhr, status, error) {
        //         alert("Có lỗi xảy ra: " + error);
        //         console.log(xhr.responseText);
        //     }
        // });
    });
});