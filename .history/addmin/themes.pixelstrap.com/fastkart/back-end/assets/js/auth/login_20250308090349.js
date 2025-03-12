$(document).ready(function () {
    $("#login-form").submit(function (event) {
        event.preventDefault(); // Ngăn chặn reload trang

        let email = $("#username").val();
        let password = $("#password").val();

        // Ẩn tất cả thông báo lỗi cũ
        $(".text-danger").hide();
        $("input").removeClass("error");

        // Kiểm tra nếu email không hợp lệ
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            $("#username-error").show(); // Hiển thị lỗi cho email
            $("#username").addClass("error");
            return;
        }

        // Kiểm tra nếu mật khẩu ít nhất 8 ký tự
        if (password.length < 8) {
            $("#password-error").show(); // Hiển thị lỗi cho mật khẩu
            $("#password").addClass("error");
            return;
        }

        // Gửi yêu cầu AJAX nếu tất cả hợp lệ
        $.ajax({
            url: "http://localhost:8080/auth/login", // API đăng nhập của bạn
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
                        localStorage.setItem("authToken", token); // Lưu token
                        window.location.href = "dashboard.html"; // Chuyển hướng
                    }
                } else {
                    showError(response.message || "Đăng nhập thất bại!");
                }
            },
            error: function (xhr) {
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    showError(xhr.responseJSON.message); 
                } else {
                    showError("Đăng nhập thất bại! Vui lòng kiểm tra lại.");
                }
            }
        });
    });
});
