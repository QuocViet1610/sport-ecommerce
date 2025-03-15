$(document).ready(function() {
    // Lấy Token từ Local Storage
    let token = localStorage.getItem("authToken");

    // Kiểm tra nếu không có Token, thông báo và dừng API call
    if (!token) {
        showError("Bạn chưa đăng nhập!");
        return;
    }

    $.ajax({
        url: "http://localhost:8080/product",
        method: "GET",
        dataType: "json",
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function(response) {
            if (response.code === "200" && Array.isArray(response.data)) {
                console.log("Danh sách sản phẩm:", response.data);
            } else {
                console.warn("Không có sản phẩm nào hoặc dữ liệu không hợp lệ.");
            }
        },
        error: function(xhr, status, error) {
  
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    alert("Lỗi: " + xhr.responseJSON.message); 
                } else {
                    alert("Có lỗi xảy ra! Mã lỗi: " + xhr.status);
                }
        }
    });
});

