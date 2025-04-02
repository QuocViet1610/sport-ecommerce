$(document).ready(function () {
// Lấy id từ URL
var id = getUrlParameter('id');
console.log(id);

// Tạo đối tượng dữ liệu
var requestData = {
    searchText: "",
    fullParentId: id
};

// Gửi yêu cầu AJAX
$.ajax({
    url: "http://localhost:8080/product/search?page=0&size=10", 
    type: "GET",  // Phương thức GET hoặc POST
    data: requestData,  // Truyền đối tượng vào đây
    success: function(response) {
        console.log(response.data.content); 
    },
    error: function(xhr, status, error) {
        console.error("Đã có lỗi xảy ra: " + error);
    }
});


});