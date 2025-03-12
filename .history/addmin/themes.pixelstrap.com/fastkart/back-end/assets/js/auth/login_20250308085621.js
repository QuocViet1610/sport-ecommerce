$(document).ready(function () {
    // Xử lý đăng nhập khi người dùng nhấn nút submit
    $("#login-form").submit(function (event) {
        event.preventDefault(); // Ngăn chặn reload trang

        let email = $("#username").val();
        let password = $("#password").val();

        // Kiểm tra nếu bỏ trống
        if (email.trim() === "" || password.trim() === "") {
            showError("Vui lòng nhập đầy đủ email và mật khẩu!");
            return;
        }

        $.ajax({
            url: "http://localhost:8080/auth/login", 
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                email: email,
                password: password
            }),
            success: function (response) {
                if (response.code === "200") { 
                    let token = response.data.token;

                    if (token) {
                        localStorage.setItem("authToken", token); 
                        window.location.href = "dashboard.html"; 
                        alert("thanh cong")
                    } else {
                        showError("Lỗi: Không nhận được token từ server!");
                    }
                } else {
                    showError(response.message || "Đăng nhập thất bại!");
                }
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    showError(xhr.responseJSON.message); // ✅ Chỉ hiển thị lỗi API trả về
                } else {
                    showError("Đăng nhập thất bại! Vui lòng kiểm tra lại."); // 🛑 Chỉ hiển thị nếu API không có `message`
                }
            }
            
        });
    });

    // Kiểm tra nếu người dùng đã đăng nhập (token đã lưu)
    function checkAuth() {
        let token = localStorage.getItem("authToken");
        if (token) {
            window.location.href = "dashboard.html"; 
        }
    }

    // Đăng xuất
    $("#logoutBtn").click(function () {
        localStorage.removeItem("authToken"); 
        window.location.href = "login.html"; 
    });

    window.checkAuth = checkAuth;
});
