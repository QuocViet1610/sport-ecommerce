let selectedImages = []; // Mảng lưu trữ các ảnh được chọn

document.querySelectorAll(".image-input").forEach(input => {
    input.addEventListener("change", function (event) {
        handleImageChange(event.target);
    });
});

function handleImageChange(inputElement) {
    const file = inputElement.files[0];
    const previewBox = inputElement.closest(".image-preview");
    if (!file || !file.type.startsWith("image/")) {
        showError("Tệp tin phải là hình ảnh");
    }
    
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
                // Xóa ảnh khỏi danh sách lưu trữ
                selectedImages = selectedImages.filter(imgObj => imgObj.file !== file);
                previewBox.innerHTML = ""; // Xóa ảnh

                // Thêm lại input file mới để chọn ảnh khác
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

            // Thêm ảnh vào danh sách lưu trữ
            selectedImages.push({ file, element: previewBox });
            console.log(`📸 Ảnh đã chọn: ${file.name}`);
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

    let attributeGroup = document.createElement("div"); // tạo div
    attributeGroup.classList.add("attribute-group"); // thêm class vào div 

    /*** Nửa 1: Nút Chỉnh Sửa & Dropdown ***/
    const selectContainer = document.createElement("div");
    selectContainer.classList.add("select-container");
    selectContainer.style.flex = "1";
    // const editBtn = document.createElement("button");
    // editBtn.classList.add("edit-attribute-btn");
    // editBtn.textContent = "✏️";
    // editBtn.onclick = () => openEditPopup(select);

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

    // selectContainer.appendChild(editBtn);
    selectContainer.appendChild(select);

    /*** Nửa 2: Value Container, Quick Select & Delete ***/
    const valueContainer = document.createElement("div");
    valueContainer.classList.add("value-container");

    const valueButton= document.createElement("div");
    const quickSelectBtn = document.createElement("button");
    quickSelectBtn.classList.add("quick-select-btn");
    quickSelectBtn.textContent = "chọn thuộc tính";
    quickSelectBtn.onclick = () => {
        select.disabled = true;
        openQuickSelectPopup(select.value, valueContainer);

    };

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-attribute-btn");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => {

        const attributeValue = select.value;
        const valueIdsToRemove = Array.from(valueContainer.querySelectorAll(".value-tag"))
        .map(tag => tag.id.replace("value-tag-", "")) // Lấy ID và loại bỏ phần tiền tố "value-tag-"
        .filter(id => id)// Lọc ra những ID hợp lệ


        removeSelectedAttributes(valueIdsToRemove);

        attributeGroup.remove();
        attributeGroup = null;  
        select.remove()
        select = null; 

        attributes = attributes.filter(attr => attr.name !== attributeValue); // loc mang 

        
        // Gọi lại hàm updateVariants để cập nhật lại bảng biến thể
        updateVariants();
    };

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action-container");
    actionContainer.style.flex = "3";
    actionContainer.appendChild(valueContainer);
    valueButton.appendChild(quickSelectBtn);
    valueButton.appendChild(deleteBtn);

    actionContainer.appendChild(valueButton);
    
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

    // check thuộc tính tồn tại 
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
        

        if (otherValues.includes(selectedValue)) {
            showError("Thuộc tính đã tồn tại.");
            $(this).val(null).trigger('change');  
            return; // Thoát khỏi hàm
        }
        

        console.log(`Giá trị mới của select ${this.id || ''}: `, selectedValue);
        
    });
});



let attributeSelected = []; // Danh sách ID các giá trị đã chọn bên ngoài


function removeSelectedAttributes(valueIdsToRemove) {
    
    if (!Array.isArray(valueIdsToRemove) || valueIdsToRemove.length === 0) return;
    attributeSelected = attributeSelected.filter(id => valueIdsToRemove.includes(id));
}

function checkSelectedAttributesTable(valueIdsToRemove) {
    
    attributeSelected = valueIdsToRemove.filter(id => !attributeSelected.includes(id));
}

// Mở popup chọn nhanh
function openQuickSelectPopup(attribute, valueContainer) {
    if (!attribute) return showError("Vui lòng chọn thuộc tính trước!");

    popup.style.display = "flex";
    attributeOptions.innerHTML = "";

    let token = localStorage.getItem("authToken");
    let selectedQuickAttributes = [];
    let tempSelectedAttributes = [];
    $.ajax({
        url: `http://localhost:8080/attribute/find-value/${attribute}`,
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function(response) {
            if (response.code === "200" && response.data) {
                const values = response.data; // Dữ liệu từ API

                values.forEach(valueObj => {
                    const option = document.createElement("div");
                    option.classList.add("attribute-option");
                    option.textContent = valueObj.name;
                    option.dataset.valueId = valueObj.id; // Lưu ID vào dataset

                    // Kiểm tra nếu giá trị đã được chọn bên ngoài
                    if (attributeSelected.includes(valueObj.id)) {
                        option.classList.add("disabled"); // Thêm class để thay đổi màu sắc
                        option.style.background= "lightgreen"; 
                        option.style.pointerEvents = "none"; // Ngăn click
                    }

                    option.onclick = () => {
                        if (!option.classList.contains("disabled")) {
                            option.classList.toggle("selected");

                            if (option.classList.contains("selected")) {
                                selectedQuickAttributes.push(valueObj);
                                // attributeSelected.push(valueObj.id);
                                tempSelectedAttributes.push(valueObj);
                            } else {
                                selectedQuickAttributes = selectedQuickAttributes.filter(attr => attr.id !== valueObj.id);
                                // attributeSelected = attributeSelected.filter(id => id !== valueObj.id);
                                tempSelectedAttributes = tempSelectedAttributes.filter(attr => attr.id !== valueObj.id);
                            
                            }
                        }
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
        // Chỉ khi nhấn Confirm, các giá trị mới được thêm vào attributeSelected
        tempSelectedAttributes.forEach(attr => {
            if (!attributeSelected.includes(attr.id)) {
                attributeSelected.push(attr.id);
            }
        });
    
        // Gọi hàm addAttributeValue để cập nhật giao diện
        addAttributeValue(attribute, tempSelectedAttributes, valueContainer);
    
        // Reset danh sách tạm
        tempSelectedAttributes = [];
    
        // Đóng popup
        popup.style.display = "none";
    };
    
}

// Đóng popup khi nhấn bỏ qua
closePopup.onclick = () => {
    popup.style.display = "none";
};

// Thêm giá trị thuộc tính vào danh sách bên ngoài
function addAttributeValue(attribute, values, valueContainer) {
    let existingAttribute = attributes.find(attr => attr.name === attribute);
    if (!existingAttribute) {
        existingAttribute = { name: attribute, values: [] };
        attributes.push(existingAttribute);
    }

    values.forEach(value => {
        if (!existingAttribute.values.some(v => v.id === value.id)) {
            existingAttribute.values.push(value);
            createValueTag(value, existingAttribute, valueContainer);
        }
    });

    updateVariants();
}

// Tạo thẻ giá trị bên ngoài
// Xóa giá trị bên ngoài và cập nhật lại bảng biến thể
function createValueTag(valueObj, attribute, container) {
    const tag = document.createElement("div");
    tag.classList.add("value-tag");
    tag.id = `value-tag-${valueObj.id}`;
    tag.textContent = valueObj.name;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "×";
    removeBtn.classList.add("remove-tag-btn");
    removeBtn.onclick = () => {
        tag.remove(); // Xóa thẻ hiển thị giá trị

        // Cập nhật danh sách giá trị trong thuộc tính
        attribute.values = attribute.values.filter(v => v.id !== valueObj.id);
        attributeSelected = attributeSelected.filter(id => id !== valueObj.id); // Cập nhật danh sách chọn

        updatePopupValues(); // Cho phép chọn lại trong popup
        updateVariants(); // Cập nhật lại bảng biến thể sau khi xóa
    };

    tag.appendChild(removeBtn);
    container.appendChild(tag);
}

// Cập nhật popup khi giá trị bị xóa bên ngoài
function updatePopupValues() {

    document.querySelectorAll(".attribute-option").forEach(option => {
        let valueId = parseInt(option.dataset.valueId);
        if (!attributeSelected.includes(valueId)) {
            option.classList.remove("disabled"); 
            option.style.background= "lightgreen"; 
            option.style.pointerEvents = "auto"; 
        }
    });

    updateVariants(); 
}

// Cập nhật bảng hàng cùng loại
function updateVariants() {
    const variants = generateVariants(attributes);
    console.log(attributes)
    renderVariants(variants);
}

// Tạo tổ hợp thuộc tính (Sửa lỗi khi chỉ có 1 giá trị thuộc tính)
function generateVariants(attributes) {
    console.log(attributes);
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
             // Lấy danh sách ID của biến thể trong hàng đó
            const variantIdString = row.querySelector(".variant-id").textContent;
            const variantIdsToRemove = variantIdString.split(",").map(id => id.trim());

            // Xóa biến thể khỏi mảng variants
            variants = variants.filter(variant => {
                const variantIds = variant.map(v => v.id.toString());
                return !variantIdsToRemove.every(id => variantIds.includes(id));
            });


            const variantIds = variants.flatMap(variant => variant.map(v => v.id));
            const uniqueVariantIds = [...new Set(variantIds)];


            const valueTags = document.querySelectorAll(".value-tag");
            valueTags.forEach(tag => {
                // Lấy ID từ value-tag, loại bỏ tiền tố "value-tag-"
                const tagId = tag.id.replace("value-tag-", "");
        
                // Kiểm tra nếu ID không có trong uniqueVariantIds, thì xóa phần tử đó
                if (!uniqueVariantIds.includes(Number(tagId))) {
                    tag.remove();
                }
            });
            attributes.forEach(attribute => {
                attribute.values = attribute.values.filter(value => uniqueVariantIds.includes(value.id));
            });
            
            checkSelectedAttributesTable(uniqueVariantIds)
            console.log(variants);
            row.remove();

        });

        variantList.appendChild(row);
    });
}



// thêm sản phẩm 
$(document).ready(function () {

// Cập nhật giá trị của .stock-quantity khi giá trị của .price thay đổi trong bảng
    const priceInput = document.querySelector('.form-control.price');
const stockInput = document.querySelector('.stock-quantity');


priceInput.addEventListener('input', function() {
    stockInput.value = priceInput.value;
});


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

        for (let request of attributeCreatRequests) {
            if (request.attributeValueIds && request.attributeValueIds.length > 0) {

            } else {
                showError(`vui lòng chọn thuộc tính`);
            }
        }

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
            "attributeCreatRequests": attributeCreatRequests
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


        formData.append("data", JSON.stringify(productData));
// Chuyển dữ liệu sản phẩm thành JSON và thêm vào formData
// Lấy hình ảnh từ input file và thêm vào FormData
            let imageInputs = document.querySelectorAll(".image-input"); // Lấy tất cả input file

            // 🛠️ **Thêm ảnh từ danh sách `selectedImages` vào FormData**
            let fileCount = 0;

            
            selectedImages.forEach((imgObj, index) => {
                formData.append("image[]", imgObj.file, imgObj.file.name);  // ✅ Gửi từng ảnh riêng biệt
                console.log(`📸 Ảnh ${index + 1}:`, imgObj.file.name, "| MIME:", imgObj.file.type);
                fileCount++;
            });
            
            // Kiểm tra FormData trước khi gửi
            for (let pair of formData.entries()) {
                console.log(`📝 ${pair[0]}:`, pair[1], "| MIME:", pair[1].type);
            }
            
        console.log(`✅ Tổng số ảnh được chọn: ${fileCount}`);
        console.log(formData); 
    // Kiểm tra trước khi gửi
    if (!fileCount > 0) {
        showError("Vui lòng chọn ít nhất một ảnh!");
    }

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
        // AJAX gửi dữ liệu lên server
        $.ajax({
            url: "http://localhost:8080/product", 
            type: "POST",
            data: formData,
            headers: {
                "Authorization": "Bearer " + token,
            },
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                showError("Thêm sản phẩm thành công!");
                setTimeout(() => {
                    window.location.href = "products.html"; // Chuyển đến trang danh sách sản phẩm
                }, 1000);
        
            },
            error: function (xhr, status, error) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    // Nếu có thông báo lỗi trong response JSON
                    showError(xhr.responseJSON.message); 
                } else {
                    // Nếu không có thông báo lỗi trong response JSON, hiển thị toàn bộ responseText
                    showError(xhr.responseText); 
                }
            }
            
        });
    });
});


var selectedBrandValue = "";
let value = ""; 
let valueModel = ""; 
var selectedObjecValue = "";
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

                // Thêm các mục vào dropdown
                $.each(data.data, function(index, item) {
                    dropdownMenu.append('<li><a class="dropdown-item dropdown-item-brand" href="#" data-name="' + item.name + '" data-id="' + item.id + '">' + item.name + '</a></li>');
                });
    
                // Thêm sự kiện click cho các mục dropdown
                $('.dropdown-item-brand').on('click', function() {
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
    

// gender
    // $.ajax({
    //     url: "http://localhost:8080/gender", 
    //     type: "GET",
    //     contentType: "application/json",
    //     headers: {
    //         "Authorization": "Bearer " + token,
    //         "Accept": "application/json"
    //     },
    //     success: function(data) {

            
    //         if(data.code == 200) {
    //             var dropdownMenu = $('#myDropdownObject');
    //             dropdownMenu.empty();
    //                 // Thêm input tìm kiếm
    //                 dropdownMenu.append('<li><input type="text" class="form-control" id="myInputObject" placeholder="Search..." onkeyup="filterFunctionObject()"></li>');
    //                 // Thêm các mục vào dropdown
    //                 $.each(data.data, function(index, item) {
    //                     dropdownMenu.append('<li><a class="dropdown-item" href="#" data-name="' + item.name + '" data-id="' + item.id + '">' + item.name + '</a></li>');
    //                 });
        
    //                 // Thêm sự kiện click cho các mục dropdown
    //                 $('.dropdown-item').on('click', function() {
    //                     event.preventDefault(); 
    //                     var selectedObject = $(this).data('name');
    //                     selectedObjecValue = $(this).data('id'); 
    //                     console.log(selectedObjecValue)
    //                     $('#dropdownButtonObject').text(selectedObject); 
    //                 });
    
    //         } else {
    //             $('#myDropdownBrand').append('<li><span>Không có thương hiệu</span></li>');
    //         }
    //     },
    //     error: function(xhr, status, error) {
    //         let dropdown = $("#myDropdownBrand");
    //         dropdown.empty();
    //         dropdown.append('<div class="dropdown-item" disabled>Chưa có thương hiệu</div>');
    //     }
    // });

                        $('.dropdown-item-object').on('click', function() {
                        event.preventDefault(); 
                        var selectedObject = $(this).data('name');
                        selectedObjecValue = $(this).data('id'); 
                        console.log(selectedObjecValue)
                        $('#dropdownButtonObject').text(selectedObject); 
                    });

    
// Hiển thị category modal
$.ajax({
    url: "http://localhost:8080/category",  
    type: "GET",
    contentType: "application/json",
    headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    },
    success: function(response) {


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
        var errorMessage = error;
        if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMessage = xhr.responseJSON.message;
        } else if (xhr.responseText) {
            try {
            var response = JSON.parse(xhr.responseText);
            errorMessage = response.message || error;
            } catch(e) {
            errorMessage = error;
            }
        }
        if (!errorMessage || errorMessage.trim() === "") {
            errorMessage = "Đã xảy ra lỗi không xác định. Vui lòng thử lại sau!";
        }
        showError( errorMessage);
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


//thêm thể loại
$(document).ready(function() {

    function isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); 
            const exp = payload.exp * 1000; 
    
            return Date.now() >= exp;
        } catch (e) {
            console.error("Token không hợp lệ:", e);
            return true; 
        }
    }
    
    let token = localStorage.getItem("authToken");

    if (!token) {
        showError("Bạn chưa đăng nhập!");
           return; 
    } else if (isTokenExpired(token)) {
        showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("authToken"); 
    } 
function handleCategoriesResponse() {

    $.ajax({
        url: "http://localhost:8080/category",  
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function(response) {
    
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
            var errorMessage = error;
            if (xhr.responseJSON && xhr.responseJSON.message) {
                errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                try {
                var response = JSON.parse(xhr.responseText);
                errorMessage = response.message || error;
                } catch(e) {
                errorMessage = error;
                }
            }
            showError( errorMessage);
            let categoryDropdown = $("#myDropdown");
            categoryDropdown.empty();
            categoryDropdown.append('<div class="dropdown-item" disabled>Không thể tải thể loại</div>');
        }
    });
    
  }



 
$('#saveCategory').on('click', function() {
    var categoryName = $('#nameCateogryInput').val();
    // Tạo đối tượng FormData
    var formData = new FormData();
    var data = {
      name: categoryName,
      parentId: valueModel
    };
    formData.append('data', JSON.stringify(data));

    $.ajax({
      url: 'http://localhost:8080/category', 
      type: 'POST',
      data: formData,
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    },
      contentType: false,
      processData: false,
      success: function(response) {
        console.log('Response:', response);
        $('#attributeModal').modal('hide');
        handleCategoriesResponse();
        selectItem(response.data.id); // Khi chọn mục cha, lưu ID vào value
        $('#dropdownButton').text(response.data.name);
      },
    error: function(xhr, status, error) {
        var errorMessage = error;
        if (xhr.responseJSON && xhr.responseJSON.message) {
            errorMessage = xhr.responseJSON.message;
        } else if (xhr.responseText) {
            try {
            var response = JSON.parse(xhr.responseText);
            errorMessage = response.message || error;
            } catch(e) {
            errorMessage = error;
            }
        }
        console.log(errorMessage)
        showError( errorMessage);
        }
    });
  });
  function selectItem(id) {
    value = id; 
    console.log("Thương hiệu được chọn: " + name + " (ID: " + id + ")");
}



function bandHandreload(){
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

                // Thêm các mục vào dropdown
                $.each(data.data, function(index, item) {
                    dropdownMenu.append('<li><a class="dropdown-item dropdown-item-brand" href="#" data-name="' + item.name + '" data-id="' + item.id + '">' + item.name + '</a></li>');
                });
    
                // Thêm sự kiện click cho các mục dropdown
                $('.dropdown-item-brand').on('click', function() {
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
}

$('#saveBrand').on('click', function() {
    var brandName = $('#brandNameInput').val().trim();

    if (!brandName) {
        showError("Tên thương hiệu không được bỏ trống");
        return;
    }

    var formData = new FormData();
    var data = {
      name: brandName,
      description: null
    };
    formData.append('data', JSON.stringify(data));

    $.ajax({
        url: 'http://localhost:8080/brand', 
        type: 'POST',
        data: formData,
        headers: {
          "Authorization": "Bearer " + token,
          "Accept": "application/json"
      },
        contentType: false,
        processData: false,
        success: function(response) {
          console.log('Response:', response);
          $('#brandModalLabel').modal('hide');
          bandHandreload();
          selectedBrandValuefunction(response.data.id); // Khi chọn mục cha, lưu ID vào value
          $('#dropdownButtonBrand').text(response.data.name);
          $('#brandModal').modal('hide');
          $('#brandNameInput').val('');
        },
      error: function(xhr, status, error) {
          var errorMessage = error;
          if (xhr.responseJSON && xhr.responseJSON.message) {
              errorMessage = xhr.responseJSON.message;
          } else if (xhr.responseText) {
              try {
              var response = JSON.parse(xhr.responseText);
              errorMessage = response.message || error;
              } catch(e) {
              errorMessage = error;
              }
          }
          console.log(errorMessage)
          showError( errorMessage);
          }
      });
    });


    function selectedBrandValuefunction(id) {
        selectedBrandValue = id; 
        console.log("Thương hiệu được chọn: " + name + " (ID: " + id + ")");
    }
});

// thuộc tính
$(document).ready(function() {
    let attributes = []; 

    
    function isTokenExpired(token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1])); 
            const exp = payload.exp * 1000; 
    
            return Date.now() >= exp;
        } catch (e) {
            console.error("Token không hợp lệ:", e);
            return true; 
        }
    }
    
    let token = localStorage.getItem("authToken");

    if (!token) {
        showError("Bạn chưa đăng nhập!");
           return; 
    } else if (isTokenExpired(token)) {
        showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("authToken"); 
    } 

    let availableAttributes = []; // Khởi tạo mảng rỗng trước

    $.ajax({
        url: "http://localhost:8080/attribute/all",  
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function(response) {

                const data = response.data;
                // Chuyển đổi dữ liệu API sang format của availableAttributes
                availableAttributes = data.map(attr => ({
                    id: attr.id,
                    name: attr.name,
                    values: attr.values.map(val => ({
                        id: val.id,
                        name: val.name
                    }))
                }));
    
                console.log("Danh sách thuộc tính đã tải:", availableAttributes);

        },
        error: function(xhr) {
            let errorMessage = xhr.responseJSON && xhr.responseJSON.message
                ? xhr.responseJSON.message
                : "Có lỗi xảy ra! Mã lỗi: " + xhr.status;
            showError(errorMessage);
        }
    });



    $('#addAttribute').on('click', function() {
        let attributeId = Date.now();
        let attributeGroup = `
            <div class="attribute-group" data-attribute-id="${attributeId}">
                <select class="form-select attribute-select">
                    <option value="">Chọn thuộc tính</option>
                    ${availableAttributes.map(attr => `<option value="${attr.id}">${attr.name}</option>`).join('')}
                </select>
                <button class="btn btn-success mt-2 addValue" data-attribute-id="${attributeId}">Thêm Giá Trị</button>
                <div class="value-list mt-2" id="valueList-${attributeId}"></div>
            </div>
        `;

        $('#attributeContainer').append(attributeGroup);
        attributes.push({ id: attributeId, attributeType: null, values: [] });
    });

    
    $(document).on('change', '.attribute-select', function() {
        let attributeId = $(this).closest('.attribute-group').data('attribute-id');
        let selectedAttribute = $(this).val();
        let attribute = attributes.find(attr => attr.id === attributeId);
        if (attribute) {
            attribute.attributeType = selectedAttribute;
            attribute.values = [];
            renderAttributes();
        }
    });

    $(document).on('click', '.addValue', function() {
        let attributeId = $(this).data('attribute-id');
        let attribute = attributes.find(attr => attr.id === attributeId);
        if (!attribute || !attribute.attributeType) {
            alert("Vui lòng chọn thuộc tính trước!");
            return;
        }

        let selectedAttribute = availableAttributes.find(attr => attr.id == attribute.attributeType);
        let selectedValues = attribute.values.map(value => value.id);

        let valueListHtml = selectedAttribute.values.map(value => {
            let isSelected = selectedValues.includes(value.id) ? 'selected' : ''; 
            let buttonClass = selectedValues.includes(value.id) ? 'btn-secondary' : 'btn-primary';
            return `
                <div class="value-item d-flex justify-content-between align-items-center ${isSelected}" data-value-id="${value.id}">
                    <span>${value.name}</span>
                    <button class="btn ${buttonClass} selectValue" data-value-id="${value.id}" data-value-name="${value.name}">
                        ${isSelected ? "Đã chọn" : "Chọn"}
                    </button>
                </div>
            `;
        }).join('');

        $('#valueList-' + attributeId).html(valueListHtml);
    });

    $(document).on('click', '.selectValue', function() {
        let valueId = $(this).data('value-id');
        let valueName = $(this).data('value-name');
        let attributeId = $(this).closest('.attribute-group').data('attribute-id');

        let attribute = attributes.find(attr => attr.id === attributeId);
        if (attribute) {
            let valueIndex = attribute.values.findIndex(value => value.id === valueId);
            
            if (valueIndex === -1) {
                attribute.values.push({ id: valueId, name: valueName });
                $(this).removeClass('btn-primary').addClass('btn-secondary').text("Đã chọn");
            } else {
                attribute.values.splice(valueIndex, 1);
                $(this).removeClass('btn-secondary').addClass('btn-primary').text("Chọn");
            }
        }

        renderAttributes();
    });

    $('#generateTable').on('click', function() {
        let variants = generateVariants(attributes);
        renderVariants(variants);
    });

    function generateVariants(attributes) {
        if (attributes.length === 0) return [];

        let allCombinations = attributes[0].values.map(value => [value]);

        for (let i = 1; i < attributes.length; i++) {
            let newCombinations = [];
            attributes[i].values.forEach(value => {
                allCombinations.forEach(existingCombo => {
                    newCombinations.push([...existingCombo, value]);
                });
            });

            allCombinations = newCombinations.length > 0 ? newCombinations : attributes[i].values.map(value => [value]);
        }

        return allCombinations;
    }

    function renderVariants(variants) {
        $('#variantTable tbody').empty();
        if (variants.length === 0) {
            $('#variantTable tbody').append('<tr><td colspan="5">Chưa có dữ liệu</td></tr>');
            return;
        }

        variants.forEach(variant => {
            let row = `
                <tr>
                    <td>${variant.map(v => `${v.name}`).join(" - ")}</td>
                    <td><input type="number" value="0" class="form-control cost-price"></td>
                    <td><input type="number" value="0" class="form-control sale-price"></td>
                    <td><input type="number" value="0" class="form-control stock-quantity"></td>
                    <td><button class="btn btn-danger remove-row">🗑</button></td>
                </tr>
            `;
            $('#variantTable tbody').append(row);
        });
    }

    $(document).on('click', '.remove-row', function() {
        $(this).closest('tr').remove();
    });
});
