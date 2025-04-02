document.addEventListener("DOMContentLoaded", function () {
    let dropdownItems = document.querySelectorAll(".dropdown-menu li");

    console.log("Script chạy! Tổng số mục dropdown:", dropdownItems.length);

    dropdownItems.forEach(item => {
        item.addEventListener("click", function (e) {
            e.stopPropagation(); // Ngăn chặn sự kiện lan ra ngoài
            let subMenu = this.querySelector(".sub-menu");

            console.log("Click vào:", this.innerText);

            // Đóng tất cả submenu trước khi mở
            document.querySelectorAll(".sub-menu").forEach(menu => {
                if (menu !== subMenu) {
                    menu.style.display = "none";
                }
            });

            // Toggle menu con (chuyển sang bên phải)
            if (subMenu) {
                let isVisible = subMenu.style.display === "block";
                subMenu.style.display = isVisible ? "none" : "block";
                console.log("Menu con:", isVisible ? "Đóng" : "Mở");

                // Đặt vị trí submenu sang phải
                subMenu.style.left = "100%"; 
                subMenu.style.right = "auto"; 

                // Đảm bảo submenu có cùng chiều cao với menu cha
                let parentMenu = this.closest(".dropdown-menu");
                if (parentMenu) {
                    subMenu.style.height = parentMenu.offsetHeight + "px";
                }
            } else {
                console.log("Không có menu con");
            }
        });
    });

    // Đóng menu khi click ra ngoài
    document.addEventListener("click", function () {
        console.log("Click ngoài menu -> đóng tất cả submenu");
        document.querySelectorAll(".sub-menu").forEach(menu => {
            menu.style.display = "none";
        });
    });
});
