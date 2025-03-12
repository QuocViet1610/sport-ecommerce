$(document).ready(function () {
    // Xử lý đăng nhập khi người dùng nhấn nút submit
    $("#login-form").submit(function (event) {
        event.preventDefault(); // Ngăn chặn reload trang

        let email = $("#username").val();
        let password = $("#password").val();

        // Kiểm tra nếu email không hợp lệ (phải là email gmail)
        let emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailPattern.test(email)) {
            showError("Email không hợp lệ");
            return;
        }

        // Kiểm tra nếu mật khẩu ít nhất 8 ký tự
        if (password.length < 8) {
            showError("Mật khẩu phải có ít nhất 8 ký tự!");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/auth/login", // 🔥 API đăng nhập của bạn
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                email: email,
                password: password
            }),
            success: function (response) {
                if (response.code === "200") { // Kiểm tra API trả về mã thành công
                    let token = response.data.token;

                    if (token) {
                        localStorage.setItem("authToken", token); // 🔥 Lưu token vào localStorage
                        window.location.href = "dashboard.html"; // ✅ Chuyển hướng sau khi đăng nhập
                    } else {
                        showError("Lỗi: Không nhận được token từ server!");
                    }
                } else {
                    showError(response.message || "Đăng nhập thất bại!");
                }
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    showError(xhr.responseJSON.message); // 🛑 Hiển thị lỗi từ API
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
            window.location.href = "dashboard.html"; // ✅ Nếu đã đăng nhập, chuyển hướng
        }
    }

    // Đăng xuất
    $("#logoutBtn").click(function () {
        localStorage.removeItem("authToken"); // 🛑 Xóa token khi đăng xuất
        window.location.href = "login.html"; // ✅ Chuyển về trang đăng nhập
    });

    // Xuất hàm kiểm tra đăng nhập để dùng trên các trang khác
    window.checkAuth = checkAuth;
});
