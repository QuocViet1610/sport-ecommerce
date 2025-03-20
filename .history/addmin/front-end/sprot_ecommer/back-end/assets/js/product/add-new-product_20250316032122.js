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

let otherValues = [];

// Thêm thuộc tính mới
addAttributeBtn.addEventListener("click", () => {


    let attributeGroup = document.createElement("div");
    attributeGroup.classList.add("attribute-group");

    /*** Nửa 1: Nút Chỉnh Sửa & Dropdown ***/
    const selectContainer = document.createElement("div");
    selectContainer.classList.add("select-container");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-attribute-btn");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => openEditPopup(select);

    // Tạo thẻ select
    let select = document.createElement("select");
    select.classList.add("attribute-dropdown", "js-example-basic-single");

    // Thêm một tùy chọn mặc định cho select
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Chọn thuộc tính";
    select.appendChild(defaultOption);

    // Lấy token từ localStorage hoặc session (tuỳ vào cách bạn lưu trữ)
    let token = localStorage.getItem("authToken");
    // Thêm thuộc tính
    // Nếu chưa có token, thông báo lỗi và dừng lại
    if (!token) {
        showError("Bạn chưa đăng nhập!");
    } else {
        // Gửi yêu cầu AJAX để lấy dữ liệu thuộc tính
        $.ajax({
            url: "http://localhost:8080/attribute/all",  
            type: "GET",
            contentType: "application/json",
            headers: {
                "Authorization": "Bearer " + token,
                "Accept": "application/json"
            },
            success: function(response) {
                if (response.code == 200) {
                    const data = response.data;

                    // Duyệt qua dữ liệu và tạo các option cho select
                    data.forEach(item => {
                        const option = document.createElement("option");
                        option.value = item.id;  // Giả sử dữ liệu trả về có thuộc tính 'id'
                        option.textContent = item.name;  // Giả sử dữ liệu trả về có thuộc tính 'name'
                        select.appendChild(option);
                    });

                    // Thêm thẻ select vào DOM (ví dụ: vào body)
                    document.body.appendChild(select);
                } else {
                    showError("Không có dữ liệu.");
                }
            },
            error: function(xhr) {
                let errorMessage = xhr.responseJSON && xhr.responseJSON.message
                    ? xhr.responseJSON.message
                    : "Có lỗi xảy ra! Mã lỗi: " + xhr.status;
                showError(errorMessage);
            }
        });
    }

    selectContainer.appendChild(editBtn);
    selectContainer.appendChild(select);

    /*** Nửa 2: Value Container, Quick Select & Delete ***/
    const valueContainer = document.createElement("div");
    valueContainer.classList.add("value-container");

    const quickSelectBtn = document.createElement("button");
    quickSelectBtn.classList.add("quick-select-btn");
    quickSelectBtn.textContent = "chọn thuộc tính";
    quickSelectBtn.onclick = () => openQuickSelectPopup(select.value, valueContainer);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-attribute-btn");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => {
        // Lưu trữ giá trị thuộc tính cần xóa
        const attributeValue = select.value;
   
        // Xóa phần tử DOM của thuộc tính
        attributeGroup.remove();
        attributeGroup = null;  
        select.remove()
        select = null;  // Xóa tham chiếu tới `select` nếu không cần sử dụng nữa
        
        // Xóa thuộc tính khỏi mảng `attributes`
        attributes = attributes.filter(attr => attr.name !== attributeValue);

        // Gọi lại hàm updateVariants để cập nhật lại bảng biến thể
        updateVariants();
    };

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action-container");
    actionContainer.appendChild(valueContainer);
    actionContainer.appendChild(quickSelectBtn);
    actionContainer.appendChild(deleteBtn);

    /*** Gán tất cả vào `attributeGroup` ***/
    attributeGroup.appendChild(selectContainer);
    attributeGroup.appendChild(actionContainer);
    attributeList.appendChild(attributeGroup);

    /*** Kích hoạt Select2 ***/
    $(document).ready(function() {
        $(select).select2();
    });
    const selectElements = document.querySelectorAll(".attribute-dropdown");  // Chọn tất cả các thẻ select trong trang
    const currentValues = [];
    selectElements.forEach(select => {
        currentValues.push(select.value); 
    });

    $(".attribute-dropdown").on("select2:select", function (e) {
        // Lấy giá trị mới được chọn từ sự kiện
        const selectedValue = $(this).val();
        
        // Lấy tất cả các select elements
        const selectElements = document.querySelectorAll(".attribute-dropdown");
        console.log(selectElements)
        // Tạo mảng chứa giá trị của tất cả các select khác (trừ select hiện tại)
        otherValues = [];
        selectElements.forEach(select => {
            // Chỉ lấy giá trị từ các select khác (không phải select hiện tại)
            if (select !== this && select.value) {
                otherValues.push(select.value);
            }
        });
        
        // Kiểm tra xem giá trị đã tồn tại trong các thẻ select khác chưa
        if (otherValues.includes(selectedValue)) {
            // Nếu giá trị đã tồn tại, ngừng hành động và thông báo lỗi
            showError("Thuộc tính đã tồn tại.");
            $(this).val(null).trigger('change');  // Reset lại giá trị và trigger sự kiện change
            return; // Thoát khỏi hàm
        }
        
        // In ra giá trị của thẻ select đã thay đổi
        console.log(`Giá trị mới của select ${this.id || ''}: `, selectedValue);
        
        // Tùy chọn: Thêm code xử lý khi select thành công
        // Ví dụ: bạn có thể thêm logic để hiển thị container cho thuộc tính đã chọn
    });
});

document.getElementById("addValueBtn").addEventListener("click", () => {
    const selectElements = document.querySelectorAll(".attribute-dropdown");  // Chọn tất cả các thẻ select trong trang

    const currentValues = [];
    selectElements.forEach(select => {
        currentValues.push(select.value); 
    });

    console.log("Tất cả giá trị hiện tại của các select:", currentValues);
});

let attributeSelected = []

// Mở popup chọn nhanh
function openQuickSelectPopup(attribute, valueContainer) {
    if (!attribute) return showError("Vui lòng chọn thuộc tính trước!");

    const selectElements = document.querySelectorAll(".attribute-dropdown"); // Chọn tất cả các thẻ select trong trang

    selectElements.forEach(select => {
        // Kiểm tra nếu giá trị của select bằng với giá trị attribute
        if (select.value === attribute) {
            select.disabled = true;  // Disable thẻ select nếu giá trị trùng với attribute
        }
    });

    popup.style.display = "flex";
    attributeOptions.innerHTML = "";

    selectedAttributeList = [];
    let token = localStorage.getItem("authToken");
    let selectedQuickAttributes = [];
    $.ajax({
        url: `http://localhost:8080/attribute/find-value/${attribute}`,  
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function(response) {
            if (response.code == "200" && response.data) {
                selectedQuickAttributes = [];
                const values = response.data; // Dữ liệu trả về từ AJAX
                console.log("values.name")
                values.forEach(valueObj => {
                    const option = document.createElement("div");
                    option.classList.add("attribute-option");
                    option.textContent = valueObj.name; // Hiển thị tên


                    if (selectedAttributeList.includes(valueObj.id)) {
                        option.classList.toggle("selected");
                    }

                    option.onclick = () => {
                        option.classList.toggle("selected");
                        if (option.classList.contains("selected")) {
                            selectedQuickAttributes.push(valueObj);
                            attributeSelected.push(valueObj.id)
                            console.log(JSON.stringify(selectedQuickAttributes))
                        } else {
                            selectedQuickAttributes = selectedQuickAttributes.filter(attr => attr.id !== valueObj.id);
                            attributeSelected = attributeSelected.filter(id => id !== valueObj.id);
                        }
                         console.log(JSON.stringify(selectedQuickAttributes))
                    };

                    attributeOptions.appendChild(option);
                });
            } else {
                console.error("Dữ liệu không hợp lệ hoặc không tìm thấy.");
            }
        },
        error: function(xhr, status, error) {
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message
                ? xhr.responseJSON.message
                : "Có lỗi xảy ra! Mã lỗi: " + xhr.status;
            showError(errorMessage);
            
        }
    });

    confirmPopup.onclick = () => {
        // Xóa tất cả các thẻ tag có trong attributeList trước khi tạo lại
 // Loại bỏ tất cả thẻ tag trong attributeList

        // Gọi hàm addAttributeValue để thêm các thẻ mới vào
        addAttributeValue(attribute, selectedQuickAttributes, valueContainer);

        // Đóng popup sau khi thêm các giá trị
        popup.style.display = "none";
    };

}

// Đóng popup khi nhấn bỏ qua
closePopup.onclick = () => {
    popup.style.display = "none";
};

// Thêm giá trị thuộc tính vào danh sách
function addAttributeValue(attribute, values, valueContainer) {

    let existingAttribute = attributes.find(attr => attr.name === attribute);
    if (!existingAttribute) {
        existingAttribute = { name: attribute, values: [] };
        attributes.push(existingAttribute);
    }

    console.log(existingAttribute)

    values.forEach(value => {
        if (!existingAttribute.values.includes(value)) {
            existingAttribute.values.push(value);

            if (values.some(attr => attr.id === value.id)) {
                createValueTag(value, existingAttribute, valueContainer, values);
            }
        }
    });
    updateVariants();
}


function createValueTag(valueObj, attribute, container, value) {
    const tag = document.createElement("div");
    tag.classList.add("value-tag");

    // Thêm ID cho thẻ tag
    tag.id = `value-tag-${valueObj.id}`;  // Gán ID cho thẻ tag theo kiểu `value-tag-{id}`

    tag.textContent = valueObj.name + valueObj.id;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-tag-btn");
    removeBtn.onclick = () => {
        tag.remove();
        attribute.values = attribute.values.filter(v => v.id !== valueObj.id);
        value = value.filter(attr => attr.id !== valueObj.id);
        updateVariants();
    };

    tag.appendChild(removeBtn);
    container.appendChild(tag);
}

// Cập nhật bảng hàng cùng loại
function updateVariants() {
    const variants = generateVariants(attributes);
    renderVariants(variants);
}

// Tạo tổ hợp thuộc tính (Sửa lỗi khi chỉ có 1 giá trị thuộc tính)
function generateVariants(attributes) {
    if (attributes.length === 0) return [];

    // Khởi tạo danh sách biến thể từ thuộc tính đầu tiên
    let allCombinations = attributes[0].values.length > 0 
        ? attributes[0].values.map(value => [{ id: value.id, name: value.name }]) 
        : [];

    // Lặp qua từng thuộc tính tiếp theo để tạo tổ hợp
    for (let i = 1; i < attributes.length; i++) {
        const newCombinations = [];
        
        attributes[i].values.forEach(value => {
            allCombinations.forEach(existingCombo => {
                // Thêm thuộc tính mới vào biến thể cũ
                newCombinations.push([...existingCombo, { id: value.id, name: value.name }]);
            });
        });

        // Cập nhật danh sách tổ hợp
        allCombinations = newCombinations.length > 0 
            ? newCombinations 
            : attributes[i].values.map(value => [{ id: value.id, name: value.name }]);
    }

    return allCombinations;
}

function renderVariants(variants) {
    let variantList = document.getElementById("variantList");
    variantList.innerHTML = "";

    if (variants.length === 0) {
        variantList.innerHTML = `<tr><td colspan="6">Chưa có dữ liệu</td></tr>`;
        return;
    }

    variants.forEach(variant => {
        const row = document.createElement("tr");

        row.innerHTML = `
        <td>${variant.map(v => `${v.name} (ID: ${v.id})`).join(" - ")}</td>
        <td style="display: none;" class="variant-id">${variant.map(v => v.id).join(",")}</td> <!-- Cột ID ẩn -->
        <td>Tự động</td>
        <td><input type="number" value="0" class="cost-price"></td>
        <td><input type="number" value="0" class="sale-price"></td>
        <td><input type="number" value="0" class="stock-quantity"></td>
        <td><button class="remove-row-btn">🗑</button></td>
             `;
    

        row.querySelector(".remove-row-btn").addEventListener("click", () => {
            row.remove();
        });

        variantList.appendChild(row);
    });
}



// thêm sản phẩm 
$(document).ready(function () {
    $(".custom-btn").on("click", function (e) {
        e.preventDefault();

        // Tạo đối tượng FormData
        let formData = new FormData();
        let description = document.querySelector(".ck-editor__editable").innerHTML;
        if (description.trim() === '<p><br data-cke-filler="true"></p>') {
            description = null;
        }    

        let price = $("#price").val().replace(/,/g, '');
        let costPrice = $("#costPrice").val().replace(/,/g, '');
        let weight = $("#weight").val().replace(/,/g, '');
        let stock = $("#stock").val().replace(/,/g, '');
        let isActive = $("input[type='checkbox']").prop('checked') ? 1 : 0;
        let attributeCreatRequests = [];
        

        const selectElements = document.querySelectorAll(".attribute-dropdown");  // Chọn tất cả các thẻ select trong trang
        let attributeGroups = document.querySelectorAll(".attribute-group");
        const currentValues = [];
        selectElements.forEach(select => {
            currentValues.push(select.value); 
        });
    
        let i = 0;
        attributeGroups.forEach(group => {
            // Lấy attributeId từ nội dung của select2
            let attributeIdElement = group.querySelector(".select2-selection__rendered");
            let attributeText = attributeIdElement ? attributeIdElement.textContent.trim() : null;
            console.log("attributeTextVluae:", attributeIdElement.value);
   
            console.log("attributeText:", attributeText);
            

            let attributeId = currentValues[i];

            i = i+1;

            let valueIds = [];
            group.querySelectorAll(".value-container .value-tag").forEach(valueTag => {
                let valueId = valueTag.id.replace("value-tag-", ""); 
                console.log(valueId);
                if (valueId) {
                    valueIds.push(parseInt(valueId));  
                }
            });

            let attributeCreatRequest = {
                attributeId: attributeId,
                attributeValueIds: valueIds,
               
            };
            attributeCreatRequests.push(attributeCreatRequest);

            

            console.log(valueIds);  
            
            // In ra giá trị attributeId và valueIds
            console.log("attributeId:", attributeId);
            console.log("valueIds:", valueIds);
        });

            
        // Lấy dữ liệu từ form input
        let productData = {
            "name": $("#productName").val() || null,
            "categoryId": value ? parseInt(value) : null,
            "price": price ? parseFloat(price) : 0,
            "costPrice": costPrice ? parseFloat(costPrice) : 0,
            "description": description || null,
            "isActive": isActive ? isActive : null,
            "brandId": selectedBrandValue ? parseInt(selectedBrandValue) || null : null,
            "supplierId": $("#supplier").val() ? parseInt($("#supplier").val()) : null,
            "genderId": $("#gender").val() ? parseInt($("#gender").val()) : 1,
            "totalSold": $("#totalSold").val() ? parseInt($("#totalSold").val()) : 0,
            "totalRating": $("#totalRating").val() ? parseFloat($("#totalRating").val()) : 0,
            "stock": stock ? parseInt(stock) : 0,
            "discountPrice": $("#discountPrice").val() ? parseFloat($("#discountPrice").val()) : 0,
            "weight": weight ? parseFloat(weight) : null,
            "attributeCreatRequests": []
        };


        // Lấy danh sách các biến thể sản phẩm
// Lấy danh sách các biến thể sản phẩm
        productData.productVariantCreateRequests = [];
        $("#variantList tr").each(function () {
            let variantAttributes = [];
            let attributesText = $(this).find("td:first").text().split(" - "); // Lấy các tên thuộc tính từ cột đầu tiên
            
            // Lấy danh sách ID từ cột ẩn
            let variantIds = $(this).find(".variant-id").text().split(","); // Lấy mảng ID từ cột ẩn
            variantIds.forEach(id => {
                console.log(variantIds)
                if (!isNaN(parseInt(id))) {
                    variantAttributes.push(parseInt(id)); // Thêm các ID vào variantAttributes
                }
            });

            let variant = {
                "productId": 1, // Hoặc thay đổi nếu cần
                "price": parseFloat($(this).find(".sale-price").val()), // Lấy giá bán
                "costPrice": parseFloat($(this).find(".cost-price").val()), // Lấy giá vốn
                "quantity": parseInt($(this).find(".stock-quantity").val()), // Lấy số lượng
                "variantAttributeIds": variantAttributes // Các ID thuộc tính của biến thể
            };

            productData.productVariantCreateRequests.push(variant);
        });


        // Chuyển dữ liệu sản phẩm thành JSON và thêm vào formData
        formData.append("data", JSON.stringify(productData));
        console.log(productData)
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
        console.log(formData);
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


var selectedBrandValue = "";
let value = ""; 
let valueModel = ""; 

$(document).ready(function() {
    function isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); // Decode phần payload của JWT
            const exp = payload.exp * 1000; // Chuyển từ giây sang milliseconds
    
            return Date.now() >= exp; // Kiểm tra nếu token đã hết hạn
        } catch (e) {
            console.error("Token không hợp lệ:", e);
            return true; // Mặc định là hết hạn nếu có lỗi
        }
    }
    
    let token = localStorage.getItem("authToken");

    if (!token) {
        showError("Bạn chưa đăng nhập!");
           return; // Dừng lại nếu không có token
    } else if (isTokenExpired(token)) {
        showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("authToken"); // Xóa token cũ
    } else {
        
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
        showError("Lỗi khi lấy dữ liệu thể loại:", xhr.responseText || error);
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



