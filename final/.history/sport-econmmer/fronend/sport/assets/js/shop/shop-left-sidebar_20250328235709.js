$(document).ready(function () {
// Lấy giá trị id từ URL
function getUrlParameter(name) {
    var url = new URL(window.location.href);
    var params = new URLSearchParams(url.search);
    return params.get(name);
}

// Lấy id từ URL
var id = getUrlParameter('id');
console.log(id); 


$.ajax({
    url: "http://localhost:8080/product/search?page=0&size=10", 
    type: "GET",  // Phương thức GET hoặc POST
    data: {
        "searchText": "",
        "fullParentId": id  
    },
    success: function(response) {
        console.log(response.data.content); 

    },
    error: function(xhr, status, error) {
        console.error("Đã có lỗi xảy ra: " + error);
    }
});


});