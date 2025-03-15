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



// Popup chỉnh sửa
const editPopup = document.createElement("div");
editPopup.classList.add("edit-popup");
editPopup.innerHTML = `
    <div class="edit-popup-content">
        <h3>Chỉnh sửa thuộc tính</h3>
        <input type="text" id="editAttributeName" class="edit-input" placeholder="Nhập tên mới">
        <div class="edit-popup-actions">
            <button id="closeEditPopup" class="cancel-btn">Hủy</button>
            <button id="saveEditPopup" class="save-btn">Lưu</button>
        </div>
    </div>
`;
document.body.appendChild(editPopup);

// Thêm thuộc tính mới
addAttributeBtn.addEventListener("click", () => {
    const attributeGroup = document.createElement("div");
    attributeGroup.classList.add("attribute-group");

    const select = document.createElement("select");
    select.classList.add("attribute-dropdown", "js-example-basic-single");
    select.innerHTML = `
        <option value="" selected>Chọn thuộc tính</option>
        <option value="thuoc_tinh_1">THUỘC TÍNH 1</option>
        <option value="thuoc_tinh_2">THUỘC TÍNH 2</option>
        <option value="thuoc_tinh_3">THUỘC TÍNH 3</option>
    `;




});

// Mở popup chỉnh sửa
function openEditPopup(selectElement) {
    const currentName = selectElement.options[selectElement.selectedIndex].text;
    const editInput = document.getElementById("editAttributeName");

    editInput.value = currentName;
    editPopup.style.display = "flex";

    document.getElementById("saveEditPopup").onclick = () => {
        const newName = editInput.value.trim();
        if (newName) {
            selectElement.options[selectElement.selectedIndex].text = newName;
            editPopup.style.display = "none";
        } else {
            alert("Tên thuộc tính không được để trống!");
        }
    };

    document.getElementById("closeEditPopup").onclick = () => {
        editPopup.style.display = "none";
    };
}

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

    let allCombinations = attributes[0].values.length > 0 
        ? attributes[0].values.map(value => [value.name]) 
        : [];

    for (let i = 1; i < attributes.length; i++) {
        const newCombinations = [];
        attributes[i].values.forEach(value => {
            allCombinations.forEach(existingCombo => {
                newCombinations.push([...existingCombo, value.name]);
            });
        });
        allCombinations = newCombinations.length > 0 ? newCombinations : attributes[i].values.map(value => [value.name]);
    }

    return allCombinations;
}


// Render danh sách hàng cùng loại
function renderVariants(variants) {
    variantList.innerHTML = "";

    if (variants.length === 0) {
        variantList.innerHTML = `<tr><td colspan="6">Chưa có dữ liệu</td></tr>`;
        return;
    }

    variants.forEach(variant => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${variant.join(" - ")}</td>
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
