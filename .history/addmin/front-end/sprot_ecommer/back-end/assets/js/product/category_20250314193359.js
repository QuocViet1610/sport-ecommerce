window.onload = function() {
    // Kiểm tra nếu đã có giá trị 'isRedirected' trong localStorage và không phải là lần tải lại trang
    if (localStorage.getItem('isRedirected') === 'true') {
      document.getElementById('categoryDiv').style.display = 'block';
      
      // Kiểm tra xem URL hiện tại có phải là trang chuyển hướng không
      if (window.location.pathname.indexOf('add-new-category.html') !== -1) {
        // Sau khi vào trang chuyển hướng, xóa 'isRedirected'
        localStorage.removeItem('isRedirected');
      }
    }
  };