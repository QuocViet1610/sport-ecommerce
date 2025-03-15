window.onload = function() {
    if (localStorage.getItem('isRedirected') === 'true') {
      document.getElementById('categoryDiv').style.display = 'block';
    }
  };