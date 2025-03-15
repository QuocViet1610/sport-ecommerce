window.onload = function() {
    if (localStorage.getItem('isRedirected') === 'true') {
      document.getElementById('categoryDiv').style.display = 'block';
      // Sau khi hiển thị, xóa giá trị 'isRedirected' để tránh ảnh hưởng đến lần chuyển hướng tiếp theo
      localStorage.removeItem('isRedirected');
    }
  };