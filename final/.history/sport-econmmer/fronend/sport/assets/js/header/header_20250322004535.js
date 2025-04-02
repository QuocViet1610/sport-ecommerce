document.addEventListener("DOMContentLoaded", function () {
    let dropdownItems = document.querySelectorAll(".dropdown-menu li");

    dropdownItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.stopPropagation(); // Ngăn chặn sự kiện lan ra ngoài
            let subMenu = this.querySelector(".sub-menu");

            // Đóng tất cả submenu trước khi mở
            document.querySelectorAll(".sub-menu").forEach(menu => {
                if (menu !== subMenu) {
                    menu.style.display = "none";
                }
            });

            // Toggle menu con
            if (subMenu) {
                subMenu.style.display = (subMenu.style.display === "block") ? "none" : "block";
            }
        });
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener("click", function () {
        document.querySelectorAll(".sub-menu").forEach(menu => {
            menu.style.display = "none";
        });
    });
});
