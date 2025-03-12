$(document).ready(function () {
    // Xử lý đăng nhập khi người dùng nhấn nút submit
    $("#login-form").submit(function (event) {
        event.preventDefault(); // Ngăn chặn reload trang

        let username = $("#username").val();
        let password = $("#password").val();

        // Kiểm tra nếu bỏ trống
        if (username.trim() === "" || password.trim() === "") {
            showError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
            return;
        }

        $.ajax({
            url: "https://example.com/api/login", // 🟢 Thay bằng API thực tế của bạn
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                username: username,
                password: password
            }),
            success: function (response) {
                let token = response.token;

                if (token) {
                    localStorage.setItem("authToken", token); // Lưu token vào localStorage
                    window.location.href = "dashboard.html"; // Chuyển hướng sau khi đăng nhập
                } else {
                    showError("Lỗi: Không nhận được token từ server!");
                }
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    showError(xhr.responseJSON.message); // Hiển thị lỗi từ API
                } else {
                    showError("Đăng nhập thất bại! Vui lòng kiểm tra lại.");
                }
            }
        });
    });

    // Kiểm tra nếu người dùng đã đăng nhập (token đã lưu)
    function checkAuth() {
        let token = localStorage.getItem("authToken");
        if (token) {
            window.location.href = "dashboard.html"; // Nếu đã đăng nhập, chuyển hướng
        }
    }

    // Đăng xuất
    $("#logoutBtn").click(function () {
        localStorage.removeItem("authToken"); // Xóa token
        window.location.href = "login.html"; // Chuyển về trang đăng nhập
    });

    // Xuất hàm kiểm tra đăng nhập để dùng trên các trang khác
    window.checkAuth = checkAuth;
});
