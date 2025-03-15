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

let attributes = [];
let selectedQuickAttributes = [];

// Thêm thuộc tính mới
addAttributeBtn.addEventListener("click", () => {
    const attributeGroup = document.createElement("div");
    attributeGroup.classList.add("attribute-group");

    const select = document.createElement("select");
    select.classList.add("attribute-dropdown");
    select.innerHTML = `
        <option value="" selected>Chọn thuộc tính</option>
        <option value="thuoc_tinh_1">THUỘC TÍNH 1</option>
        <option value="thuoc_tinh_2">THUỘC TÍNH 2</option>
        <option value="thuoc_tinh_3">THUỘC TÍNH 3</option>
    `;

    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("attribute-input");
    input.placeholder = "Nhập giá trị thuộc tính và enter";

    const quickSelectBtn = document.createElement("button");
    quickSelectBtn.classList.add("quick-select-btn");
    quickSelectBtn.textContent = "Chọn nhanh";
    quickSelectBtn.onclick = () => openQuickSelectPopup(input);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-attribute-btn");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => {
        attributeGroup.remove();
    };

    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter" && input.value.trim() !== "") {
            addAttributeValue(select.value, input.value.trim());
            input.value = "";
            event.preventDefault();
        }
    });

    attributeGroup.appendChild(select);
    attributeGroup.appendChild(input);
    attributeGroup.appendChild(quickSelectBtn);
    attributeGroup.appendChild(deleteBtn);
    attributeList.appendChild(attributeGroup);
});

// Mở popup chọn nhanh
function openQuickSelectPopup(inputField) {
    popup.style.display = "flex";

    // Làm rỗng danh sách giá trị thuộc tính
    attributeOptions.innerHTML = "";

    // Danh sách mẫu giá trị thuộc tính
    const values = ["DD", "XL", "L", "M", "S"];
    
    values.forEach(value => {
        const option = document.createElement("div");
        option.classList.add("attribute-option");
        option.textContent = value;
        option.onclick = () => {
            option.classList.toggle("selected");
            if (option.classList.contains("selected")) {
                selectedQuickAttributes.push(value);
            } else {
                selectedQuickAttributes = selectedQuickAttributes.filter(attr => attr !== value);
            }
        };
        attributeOptions.appendChild(option);
    });

    // Khi chọn xong
    confirmPopup.onclick = () => {
        inputField.value = selectedQuickAttributes.join(", ");
        popup.style.display = "none";
    };
}

// Đóng popup khi nhấn bỏ qua
closePopup.onclick = () => {
    popup.style.display = "none";
};
