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

// Thêm thuộc tính mới
addAttributeBtn.addEventListener("click", () => {
    const attributeGroup = document.createElement("div");
    attributeGroup.classList.add("attribute-group");

    /*** Nửa 1: Nút Chỉnh Sửa & Dropdown ***/
    const selectContainer = document.createElement("div");
    selectContainer.classList.add("select-container");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-attribute-btn");
    editBtn.textContent = "✏️";
    editBtn.onclick = () => openEditPopup(select);

    let token = localStorage.getItem("authToken");
    
    if (!token) {
        showError("Bạn chưa đăng nhập!");
        return;
    }
    const select = document.createElement("select");
    document.body.appendChild(select);  // Bạn có thể thay đổi phần tử này nếu cần
    
    
    // Gửi yêu cầu AJAX để lấy dữ liệu thuộc tính từ API
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
                console.log(response.data);  // Debug: Kiểm tra dữ liệu trả về từ API
    
                // Giả sử dữ liệu từ API là một mảng các thuộc tính
                const attributes = response.data;
    
                // Tạo dropdown cho thương hiệu
                const dropdownWrapper = document.createElement("div");
                dropdownWrapper.classList.add("custom-dropdown-container");
    
                const dropdownButton = document.createElement("button");
                dropdownButton.classList.add("btn", "btn-success", "dropdown-toggle", "w-100", "custom-dropdown-button");
                dropdownButton.type = "button";
                dropdownButton.setAttribute("id", "customDropdownButton");
                dropdownButton.setAttribute("aria-expanded", "false");
                dropdownButton.style.backgroundColor = "#F9F9F6";
    
                dropdownButton.textContent = "Chọn thuộc tính";
    
                const dropdownMenu = document.createElement("ul");
                dropdownMenu.classList.add("dropdown-menu", "w-100");
                dropdownMenu.setAttribute("id", "customDropdownMenu");
    
                // Tạo ô tìm kiếm
                const searchInput = document.createElement("li");
                searchInput.innerHTML = '<input type="text" class="form-control" id="searchInput" placeholder="Search..." onkeyup="filterFunction()">';
                dropdownMenu.appendChild(searchInput);
    
                // Duyệt qua dữ liệu trả về từ API và thêm từng mục vào dropdown
                attributes.forEach(attribute => {
                    const listItem = document.createElement("li");
                    listItem.innerHTML = `<a class="dropdown-item" href="#" data-id="${attribute.id}">${attribute.name}</a>`;
                    dropdownMenu.appendChild(listItem);
                });
    
                // Gắn dropdown vào DOM
                dropdownWrapper.appendChild(dropdownButton);
                dropdownWrapper.appendChild(dropdownMenu);
                document.body.appendChild(dropdownWrapper); // Bạn có thể thay đổi vị trí để phù hợp
    
                // Lắng nghe sự kiện click trên từng item của dropdown
                $('#customDropdownMenu').on('click', '.dropdown-item', function() {
                    const selectedAttributeName = $(this).text();  // Lấy tên thuộc tính đã chọn
                    const selectedAttributeId = $(this).data('id');  // Lấy ID của thuộc tính
    
                    // Cập nhật tên thuộc tính vào nút dropdown
                    $('#customDropdownButton').text(selectedAttributeName);
    
                    // Lưu ID vào biến hoặc làm gì đó với ID
                    console.log('ID của thuộc tính đã chọn:', selectedAttributeId);
    
                    // Hiển thị ID trong một phần tử div hoặc làm gì đó với ID
                    document.getElementById('selectedIdDisplay').textContent = `ID thuộc tính đã chọn: ${selectedAttributeId}`;
                });
    
            } else {
                showError('Không thể tải dữ liệu thuộc tính!');
            }
        },
        error: function(xhr) {
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message 
                ? xhr.responseJSON.message 
                : "Có lỗi xảy ra! Mã lỗi: " + xhr.status;
            showError(errorMessage);
        }
    });
    
    // Hàm tìm kiếm trong dropdown
    function filterFunction() {
        const input = document.getElementById("searchInput");
        const filter = input.value.toUpperCase();
        const dropdownItems = document.querySelectorAll("#customDropdownMenu li");
    
        dropdownItems.forEach(item => {
            const text = item.textContent || item.innerText;
            if (text.toUpperCase().indexOf(filter) > -1) {
                item.style.display = "";
            } else {
                item.style.display = "none";
            }
        });
    }
    
    // Hàm hiển thị thông báo lỗi
    function showError(message) {
        alert(message);
    }
    



    // Hàm để hiển thị lỗi (có thể thay thế với một cách hiển thị lỗi khác)
    function showError(message) {
        alert(message);
    }
    

    selectContainer.appendChild(editBtn);
    selectContainer.appendChild(select);

    /*** Nửa 2: Value Container, Quick Select & Delete ***/
    const valueContainer = document.createElement("div");
    valueContainer.classList.add("value-container");

    const quickSelectBtn = document.createElement("button");
    quickSelectBtn.classList.add("quick-select-btn");
    quickSelectBtn.textContent = "Chọn nhanh";
    quickSelectBtn.onclick = () => openQuickSelectPopup(select.value, valueContainer);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-attribute-btn");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => {
        attributeGroup.remove();
        attributes = attributes.filter(attr => attr.name !== select.value);
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
});


const values = [
    { id: 1, name: "DD" },
    { id: 2, name: "XL" },
    { id: 3, name: "L" },
    { id: 4, name: "M" },
    { id: 5, name: "S" }
];

// Mở popup chọn nhanh
function openQuickSelectPopup(attribute, valueContainer) {
    if (!attribute) return alert("Vui lòng chọn thuộc tính trước!");

    popup.style.display = "flex";
    attributeOptions.innerHTML = "";
    selectedQuickAttributes = [];

    values.forEach(valueObj => {
        const option = document.createElement("div");
        option.classList.add("attribute-option");
        option.textContent = valueObj.name; // Chỉ hiển thị tên

        option.onclick = () => {
            option.classList.toggle("selected");
            if (option.classList.contains("selected")) {
                selectedQuickAttributes.push(valueObj);
            } else {
                selectedQuickAttributes = selectedQuickAttributes.filter(attr => attr.id !== valueObj.id);
            }
        };

        attributeOptions.appendChild(option);
    });

    confirmPopup.onclick = () => {
        addAttributeValue(attribute, selectedQuickAttributes, valueContainer);
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

    values.forEach(value => {
        if (!existingAttribute.values.includes(value)) {
            existingAttribute.values.push(value);
            createValueTag(value, existingAttribute, valueContainer);
        }
    });

    updateVariants();
}

function createValueTag(valueObj, attribute, container) {
    const tag = document.createElement("div");
    tag.classList.add("value-tag");
    tag.textContent = valueObj.name; // Chỉ hiển thị tên, không hiển thị ID

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-tag-btn");
    removeBtn.onclick = () => {
        tag.remove();
        attribute.values = attribute.values.filter(v => v.id !== valueObj.id);
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