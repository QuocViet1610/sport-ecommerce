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

    const select = document.createElement("select");
    select.classList.add("attribute-dropdown", "js-example-basic-single");
    select.innerHTML = `
        <option value="" selected>Chọn thuộc tính</option>
        <option value="thuoc_tinh_1">THUỘC TÍNH 1</option>
        <option value="thuoc_tinh_2">THUỘC TÍNH 2</option>
        <option value="thuoc_tinh_3">THUỘC TÍNH 3</option>
    `;

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
            "categoryId": $("#category").val() ? parseInt($("#category").val()) : null,
            "price": $("#price").val() ? parseFloat($("#price").val()) : 0,
            "costPrice": $("#costPrice").val() ? parseFloat($("#costPrice").val()) : 0,
            "description": description || null,
            "isActive": $("#isActive").length ? ($("#isActive").is(":checked") ? 1 : 0) : null,
            "brandId": $("#brand").val() ? parseInt($("#brand").val()) || null : null,
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



$(document).ready(function() {
    let token = localStorage.getItem("authToken");

    if (!token) {
        console.error("Bạn chưa đăng nhập!");
        return;
    }


    
    $.ajax({
        url: "http://localhost:8080/brand", // Sửa lỗi URL
        type: "GET",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function(response) {
            let brandSelect = $("#brand");
            brandSelect.empty(); // Xóa các option cũ

            if (response.data && response.data.length > 0) {
                brandSelect.append('<option value="" selected>Chọn thương hiệu</option>');
                response.data.forEach(item => {
                    brandSelect.append(`<option value="${item.id}">${item.name}</option>`);
                });
            } else {
                // Nếu không có dữ liệu, hiển thị dòng "Thương hiệu chưa có"
                brandSelect.append('<option value="" disabled selected>Chưa có thương hiệu</option>');
            }
        },
        error: function(xhr, status, error) {
            if (xhr.responseJSON && xhr.responseJSON.message) {
                showError(xhr.responseJSON.message); 
                let brandSelect = $("#brand");
                brandSelect.empty();
                brandSelect.append('<option value="" disabled selected>chưa có thương hiệu</option>');
            } else {
                showError("Đăng nhập thất bại! Vui lòng kiểm tra lại.");
                let brandSelect = $("#brand");
                brandSelect.empty();
                brandSelect.append('<option value="" disabled selected>chưa có thương hiệu</option>');
            }
        
        }
    });
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
    
                // Phân loại các mục theo parentId
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
    
                // Hàm đệ quy để thêm các mục con cho mỗi mục cha
                function addChildrenRecursively(parentId, level) {
                    if (children[parentId]) {
                        children[parentId].forEach(function(child) {
                            // Tạo option cho mục con
                            var childOption = $('<option>', {
                                value: child.id,
                                html: '&nbsp;&nbsp;&nbsp;&nbsp;'.repeat(level) + child.name, 
                                style: 'padding-left: ' + (20 * level) + 'px !important;' 
                            });
    
                            // Thêm mục con vào select
                            $('#category').append(childOption);
    
                            addChildrenRecursively(child.id, level + 1);
                        });
                    }
                }
    
                // Thêm các mục cha vào select
                parents.forEach(function(parent) {
                    var parentOption = $('<option>', {
                        value: parent.id,
                        text: parent.name
                    });
                    $('#category').append(parentOption);
    
                    // Kiểm tra các mục con của cha hiện tại
                    addChildrenRecursively(parent.id, 1);
                });
            } else {
                alert('Lỗi: ' + response.message);
            }
        },
        error: function(xhr, status, error) {
            console.error("Lỗi khi lấy dữ liệu thể loại:", xhr.responseText || error);
            let categorySelect = $("#category");
            categorySelect.empty();
            categorySelect.append('<option value="" disabled>Không thể tải thể loại</option>');
        }
    });
    document.getElementById('category-select').addEventListener('change', function() {
    const selectedValue = this.value;
    console.log('Đã chọn thể loại:', selectedValue);
    // Có thể xử lý thêm logic khi người dùng chọn một thể loại
});

});




document.getElementById('productName').addEventListener('input', function() {
    localStorage.setItem('productName', this.value);
  });

  document.getElementById('category').addEventListener('change', function() {
    localStorage.setItem('category', this.value);
  });

  document.getElementById('brand').addEventListener('change', function() {
    localStorage.setItem('brand', this.value);
  });

  document.getElementById('stock').addEventListener('input', function() {
    localStorage.setItem('stock', this.value);
  });

  document.getElementById('weight').addEventListener('input', function() {
    localStorage.setItem('weight', this.value);
  });

  document.getElementById('price').addEventListener('input', function() {
    localStorage.setItem('price', this.value);
  });

  document.getElementById('costPrice').addEventListener('input', function() {
    localStorage.setItem('costPrice', this.value);
  });

  // Đảm bảo rằng các giá trị được gán lại khi trang được tải lại
  window.onload = function() {
    if (localStorage.getItem('productName')) {
      document.getElementById('productName').value = localStorage.getItem('productName');
    }
    if (localStorage.getItem('category')) {
      document.getElementById('category').value = localStorage.getItem('category');
    }
    if (localStorage.getItem('brand')) {
      document.getElementById('brand').value = localStorage.getItem('brand');
    }
    if (localStorage.getItem('stock')) {
      document.getElementById('stock').value = localStorage.getItem('stock');
    }
    if (localStorage.getItem('weight')) {
      document.getElementById('weight').value = localStorage.getItem('weight');
    }
    if (localStorage.getItem('price')) {
      document.getElementById('price').value = localStorage.getItem('price');
    }
    if (localStorage.getItem('costPrice')) {
      document.getElementById('costPrice').value = localStorage.getItem('costPrice');
    }
  };

  // Xóa tất cả giá trị trong localStorage khi người dùng nhấn nút "Bỏ qua" hoặc "Đăng xuất"
  document.querySelector('.btn.btn-outline-secondary').addEventListener('click', function() {
    localStorage.removeItem('productName');
    localStorage.removeItem('category');
    localStorage.removeItem('brand');
    localStorage.removeItem('stock');
    localStorage.removeItem('weight');
    localStorage.removeItem('price');
    localStorage.removeItem('costPrice');
  });



  function saveAttributeData() {
    let attributes = [];
    let variants = [];

    // Lấy tất cả các thuộc tính đã thêm vào
    document.querySelectorAll('.attribute-container .attribute').forEach(function(attribute) {
      let name = attribute.querySelector('.attribute-name').value;
      let value = attribute.querySelector('.attribute-value').value;
      if (name && value) {
        attributes.push({ name: name, value: value });
      }
    });

    // Lưu thuộc tính vào localStorage
    localStorage.setItem('attributes', JSON.stringify(attributes));

    // Lấy tất cả các variant đã thêm vào
    document.querySelectorAll('.variant-container .variant').forEach(function(variant) {
      let attributeValue = variant.querySelector('.variant-attribute-value').value;
      let productCode = variant.querySelector('.variant-product-code').value;
      let costPrice = variant.querySelector('.variant-cost-price').value;
      let salePrice = variant.querySelector('.variant-sale-price').value;
      let stock = variant.querySelector('.variant-stock').value;

      if (attributeValue && productCode && costPrice && salePrice && stock) {
        variants.push({
          attributeValue: attributeValue,
          productCode: productCode,
          costPrice: costPrice,
          salePrice: salePrice,
          stock: stock
        });
      }
    });

    // Lưu variant vào localStorage
    localStorage.setItem('variants', JSON.stringify(variants));
  }

  // Đọc và hiển thị thuộc tính và variant khi tải lại trang
  window.onload = function() {
    // Lấy thuộc tính từ localStorage và hiển thị
    let attributes = JSON.parse(localStorage.getItem('attributes'));
    if (attributes && Array.isArray(attributes)) {
      attributes.forEach(function(attribute) {
        let attributeDiv = document.createElement('div');
        attributeDiv.classList.add('attribute');
        attributeDiv.innerHTML = `
          <input type="text" class="attribute-name" value="${attribute.name}" placeholder="Tên thuộc tính">
          <input type="text" class="attribute-value" value="${attribute.value}" placeholder="Giá trị thuộc tính">
        `;
        document.querySelector('.attribute-container').appendChild(attributeDiv);
      });
    }

    // Lấy variant từ localStorage và hiển thị
    let variants = JSON.parse(localStorage.getItem('variants'));
    if (variants && Array.isArray(variants)) {
      variants.forEach(function(variant) {
        let variantDiv = document.createElement('div');
        variantDiv.classList.add('variant');
        variantDiv.innerHTML = `
          <input type="text" class="variant-attribute-value" value="${variant.attributeValue}" placeholder="Giá trị thuộc tính">
          <input type="text" class="variant-product-code" value="${variant.productCode}" placeholder="Mã sản phẩm">
          <input type="number" class="variant-cost-price" value="${variant.costPrice}" placeholder="Giá vốn">
          <input type="number" class="variant-sale-price" value="${variant.salePrice}" placeholder="Giá bán">
          <input type="number" class="variant-stock" value="${variant.stock}" placeholder="Tồn kho">
        `;
        document.querySelector('.variant-container').appendChild(variantDiv);
      });
    }

    // Đảm bảo rằng dữ liệu nhập vào các trường thông thường cũng được duy trì
    if (localStorage.getItem('productName')) {
      document.getElementById('productName').value = localStorage.getItem('productName');
    }
    if (localStorage.getItem('category')) {
      document.getElementById('category').value = localStorage.getItem('category');
    }
    if (localStorage.getItem('brand')) {
      document.getElementById('brand').value = localStorage.getItem('brand');
    }
    if (localStorage.getItem('stock')) {
      document.getElementById('stock').value = localStorage.getItem('stock');
    }
    if (localStorage.getItem('weight')) {
      document.getElementById('weight').value = localStorage.getItem('weight');
    }
    if (localStorage.getItem('price')) {
      document.getElementById('price').value = localStorage.getItem('price');
    }
    if (localStorage.getItem('costPrice')) {
      document.getElementById('costPrice').value = localStorage.getItem('costPrice');
    }
  };

  // Lắng nghe sự kiện khi người dùng thay đổi thuộc tính hoặc variant
  document.querySelector('.attribute-container').addEventListener('input', saveAttributeData);
  document.querySelector('.variant-container').addEventListener('input', saveAttributeData);


