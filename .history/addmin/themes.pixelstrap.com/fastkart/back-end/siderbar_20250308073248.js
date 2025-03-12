document.addEventListener("DOMContentLoaded", function() {
    fetch("header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            updateCartCount(); // Gọi hàm cập nhật dữ liệu động
        });

    function updateCartCount() {
        let cartCount = localStorage.getItem("cartCount") || 0;
        document.getElementById("cart-count").innerText = cartCount;
    }
});
