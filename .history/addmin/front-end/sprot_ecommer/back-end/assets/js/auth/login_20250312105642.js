$(document).ready(function () {


    checkAuth();


    $("#login-form").submit(function (event) {
        event.preventDefault();

        let email = $("#username").val();
        let password = $("#password").val();
        let rememberMe = $("#rememberMe").prop("checked"); 

        let emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailPattern.test(email)) {
            showError("Email không hợp lệ");
            return;
        }


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
    
                        if (rememberMe) {
                            localStorage.setItem("authToken", token);
                            localStorage.setItem("username", email);
                            localStorage.setItem("password", password);
                        }
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

    function checkAuth() {
        let token = localStorage.getItem("authToken");
        if (token) {
            window.location.href = "index.html"; 
        } else {
            let username = localStorage.getItem("username");
            let password = localStorage.getItem("password");

            if (username && password) {
                $("#username").val(username);
                $("#password").val(password);
                $("#rememberMe").prop("checked", true); 
            }
        }
    }

    function isTokenExpired(token) {
        try {
            let payloadBase64 = token.split('.')[1]; 
            let payloadJson = atob(payloadBase64);  
            let payload = JSON.parse(payloadJson); 
            
            let exp = payload.exp; 
            let currentTime = Math.floor(Date.now() / 1000); 
    
            return exp < currentTime; 
        } catch (error) {
            console.error("Token không hợp lệ:", error);
            return true; 
        }
    }

    // Đăng xuất
    $("#logoutBtn").click(function () {
        localStorage.removeItem("authToken"); 
        localStorage.removeItem("username"); 
        localStorage.removeItem("password"); 
        window.location.href = "login.html"; 
    });

    window.checkAuth = checkAuth;
});
