$(document).ready(function () {
    // Xử lý đăng nhập khi người dùng nhấn nút submit
    $("form").submit(function (event) {
        event.preventDefault(); // Ngăn chặn reload trang

        let username = $("#username").val();
        let password = $("#password").val();

        // Kiểm tra nếu bỏ trống
        if (username === "" || password === "") {
            showError("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!");
            return;
        }

        $.ajax({
            url: "https://example.com/api/login", // 🟢 Thay bằng API thực tế
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
                if (xhr.status === 404) {
                    showError("Người dùng không tồn tại!");
                } else {
                    showError("Đăng nhập thất bại: " + xhr.responseJSON.message);
                }
            }
        });
    });

    // Hiển thị thông báo lỗi ở góc trên bên phải
    function showError(message) {
        $(".error-message").remove(); // Xóa thông báo cũ (nếu có)
        
        let errorHtml = `
            <div class="error-message">
                <div class="error-icon">✖</div>
                <div class="error-text">${message}</div>
            </div>
        `;

        $("body").append(errorHtml); // Thêm vào cuối trang

        setTimeout(function () {
            $(".error-message").fadeOut(500, function () {
                $(this).remove();
            });
        }, 3000);
    }
});
