document.getElementById("formFile").addEventListener("change", function (event) {
    const files = Array.from(event.target.files);
    const previewBoxes = document.querySelectorAll(".image-preview");

    files.forEach((file, index) => {
        if (index < 5 && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const previewBox = previewBoxes[index];
                previewBox.innerHTML = ""; // Xóa nội dung cũ

                const img = document.createElement("img");
                img.src = e.target.result;
                img.style.display = "block";

                const removeBtn = document.createElement("button");
                removeBtn.textContent = "×";
                removeBtn.classList.add("remove-btn");
                removeBtn.onclick = () => {
                    previewBox.innerHTML = "<span>+</span>";
                };

                previewBox.appendChild(img);
                previewBox.appendChild(removeBtn);
            };
            reader.readAsDataURL(file);
        }
    });
});
