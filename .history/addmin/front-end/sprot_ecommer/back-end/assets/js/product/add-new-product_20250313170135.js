document.querySelectorAll(".image-input").forEach(input => {
    input.addEventListener("change", inputChangeHandler);
});

function inputChangeHandler(event) {
    const file = event.target.files[0];
    const previewBox = event.target.closest(".image-preview");

    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewBox.innerHTML = ""; // Xóa input file cũ

            const img = document.createElement("img");
            img.src = e.target.result;
            img.style.display = "block";

            const removeBtn = document.createElement("button");
            removeBtn.textContent = "×";
            removeBtn.classList.add("remove-btn");
            removeBtn.onclick = () => {
                previewBox.innerHTML = ""; // Xóa ảnh
                const newInput = document.createElement("input");
                newInput.type = "file";
                newInput.classList.add("image-input");
                newInput.accept = "image/*";
                newInput.addEventListener("change", inputChangeHandler);
                previewBox.appendChild(newInput);
            };

            previewBox.appendChild(img);
            previewBox.appendChild(removeBtn);
        };
        reader.readAsDataURL(file);
    }
}
