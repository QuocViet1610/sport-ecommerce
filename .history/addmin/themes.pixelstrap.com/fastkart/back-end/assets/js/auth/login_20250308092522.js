$(document).ready(function () {


    // Lấy phần tử form và checkbox
const loginForm = document.getElementById("loginForm");
const rememberMeCheckbox = document.getElementById("rememberMe");

// Kiểm tra nếu có thông tin đăng nhập đã lưu trong localStorage khi tải trang
window.onload = function() {
  if (localStorage.getItem("rememberMe") === "true") {
    // Nếu có, tự động điền thông tin đăng nhập
    document.getElementById("username").value = localStorage.getItem("username");
    document.getElementById("password").value = localStorage.getItem("password");
    rememberMeCheckbox.checked = true; // Checkbox sẽ được chọn
  }
}

// Xử lý sự kiện khi người dùng gửi form
loginForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Ngừng gửi form để xử lý logic

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // Nếu checkbox "Nhớ mật khẩu" được chọn
  if (rememberMeCheckbox.checked) {
    localStorage.setItem("rememberMe", "true");
    localStorage.setItem("username", username);
    localStorage.setItem("password", password);
  } else {
    localStorage.removeItem("rememberMe");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  }

  // Kiểm tra thông tin đăng nhập và chuyển hướng đến dashboard (Giả sử là username = "admin" và password = "admin123")
  if (username === "admin" && password === "admin123") {
    // Nếu thông tin hợp lệ, chuyển hướng tới dashboard
    window.location.href = "/dashboard";
  } else {
    // Nếu thông tin không hợp lệ, bạn có thể hiển thị thông báo lỗi
    alert("Thông tin đăng nhập không đúng.");
  }
});

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
                        window.location.href = "index.html"; 
                    } else {
                        showError("Lỗi: Không nhận được token từ server!");
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

    // Xuất hàm kiểm tra đăng nhập để dùng trên các trang khác
    window.checkAuth = checkAuth;
});


