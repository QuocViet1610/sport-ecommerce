window.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('isRedirected') === 'true') {
      // Kiểm tra URL của trang
      if (window.location.pathname.indexOf('add-new-category.html') !== -1) {
        // Sau khi vào trang chuyển hướng, xóa 'isRedirected'
        localStorage.removeItem('isRedirected');
      }
    }
  });
  