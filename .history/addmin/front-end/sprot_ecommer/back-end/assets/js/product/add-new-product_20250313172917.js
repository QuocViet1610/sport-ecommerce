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
const variantList = document.getElementById("variantList");

let attributes = [];
let variants = [];

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

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-attribute-btn");
    deleteBtn.textContent = "🗑";
    deleteBtn.onclick = () => {
        attributeGroup.remove();
        updateVariants();
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
    attributeGroup.appendChild(deleteBtn);
    attributeList.appendChild(attributeGroup);
});

function addAttributeValue(attribute, value) {
    if (!attribute) return alert("Vui lòng chọn thuộc tính trước!");

    let existingAttribute = attributes.find(attr => attr.name === attribute);
    if (existingAttribute) {
        if (!existingAttribute.values.includes(value)) {
            existingAttribute.values.push(value);
        }
    } else {
        attributes.push({ name: attribute, values: [value] });
    }
    updateVariants();
}

function updateVariants() {
    variants = generateVariants(attributes);
    renderVariants();
}

function generateVariants(attributes) {
    if (attributes.length === 0) return [];

    let allCombinations = attributes[0].values.map(value => [value]);

    for (let i = 1; i < attributes.length; i++) {
        const newCombinations = [];
        attributes[i].values.forEach(value => {
            allCombinations.forEach(existingCombo => {
                newCombinations.push([...existingCombo, value]);
            });
        });
        allCombinations = newCombinations;
    }

    return allCombinations;
}

function renderVariants() {
    variantList.innerHTML = "";
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
