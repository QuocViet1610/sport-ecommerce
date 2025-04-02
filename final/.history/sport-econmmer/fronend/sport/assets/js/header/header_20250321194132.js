document.addEventListener("DOMContentLoaded", function () {
    let dropdowns = document.querySelectorAll(".dropdown-toggle");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function (e) {
            e.preventDefault();
            
            let menu = this.nextElementSibling;
            let isActive = menu.classList.contains("active");

            // Đóng tất cả menu trước khi mở menu mới
            document.querySelectorAll(".dropdown-menu").forEach(item => {
                item.classList.remove("active");
            });

            // Toggle menu
            if (!isActive) {
                menu.classList.add("active");
            }
        });
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".nav-item")) {
            document.querySelectorAll(".dropdown-menu").forEach(menu => {
                menu.classList.remove("active");
            });
        }
    });
});