window.onload = function() {
    if (localStorage.getItem('isRedirected') === 'true') {
      document.getElementById('categoryDiv').style.display = 'block';
      
      // Kiểm tra xem URL hiện tại có phải là trang chuyển hướng không
      if (window.location.href.indexOf('add-new-category.html') !== -1) {
        localStorage.removeItem('isRedirected');
      }
    }
  };