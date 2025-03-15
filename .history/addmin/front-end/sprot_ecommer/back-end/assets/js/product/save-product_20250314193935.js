
  document.getElementById('productName').addEventListener('input', function() {
    localStorage.setItem('productName', this.value);
  });

  document.getElementById('category').addEventListener('change', function() {
    localStorage.setItem('category', this.value);
  });

  document.getElementById('brand').addEventListener('change', function() {
    localStorage.setItem('brand', this.value);
  });

  document.getElementById('stock').addEventListener('input', function() {
    localStorage.setItem('stock', this.value);
  });

  document.getElementById('weight').addEventListener('input', function() {
    localStorage.setItem('weight', this.value);
  });

  document.getElementById('price').addEventListener('input', function() {
    localStorage.setItem('price', this.value);
  });

  document.getElementById('costPrice').addEventListener('input', function() {
    localStorage.setItem('costPrice', this.value);
  });

  // Đảm bảo rằng các giá trị được gán lại khi trang được tải lại
  window.onload = function() {
    if (localStorage.getItem('productName')) {
      document.getElementById('productName').value = localStorage.getItem('productName');
    }
    if (localStorage.getItem('category')) {
      document.getElementById('category').value = localStorage.getItem('category');
    }
    if (localStorage.getItem('brand')) {
      document.getElementById('brand').value = localStorage.getItem('brand');
    }
    if (localStorage.getItem('stock')) {
      document.getElementById('stock').value = localStorage.getItem('stock');
    }
    if (localStorage.getItem('weight')) {
      document.getElementById('weight').value = localStorage.getItem('weight');
    }
    if (localStorage.getItem('price')) {
      document.getElementById('price').value = localStorage.getItem('price');
    }
    if (localStorage.getItem('costPrice')) {
      document.getElementById('costPrice').value = localStorage.getItem('costPrice');
    }
  };

  // Xóa tất cả giá trị trong localStorage khi người dùng nhấn nút "Bỏ qua" hoặc "Đăng xuất"
  document.querySelector('.btn.btn-outline-secondary').addEventListener('click', function() {
    localStorage.removeItem('productName');
    localStorage.removeItem('category');
    localStorage.removeItem('brand');
    localStorage.removeItem('stock');
    localStorage.removeItem('weight');
    localStorage.removeItem('price');
    localStorage.removeItem('costPrice');
  });



  function saveAttributeData() {
    let attributes = [];
    let variants = [];

    // Lấy tất cả các thuộc tính đã thêm vào
    document.querySelectorAll('.attribute-container .attribute').forEach(function(attribute) {
      let name = attribute.querySelector('.attribute-name').value;
      let value = attribute.querySelector('.attribute-value').value;
      if (name && value) {
        attributes.push({ name: name, value: value });
      }
    });

    // Lưu thuộc tính vào localStorage
    localStorage.setItem('attributes', JSON.stringify(attributes));

    // Lấy tất cả các variant đã thêm vào
    document.querySelectorAll('.variant-container .variant').forEach(function(variant) {
      let attributeValue = variant.querySelector('.variant-attribute-value').value;
      let productCode = variant.querySelector('.variant-product-code').value;
      let costPrice = variant.querySelector('.variant-cost-price').value;
      let salePrice = variant.querySelector('.variant-sale-price').value;
      let stock = variant.querySelector('.variant-stock').value;

      if (attributeValue && productCode && costPrice && salePrice && stock) {
        variants.push({
          attributeValue: attributeValue,
          productCode: productCode,
          costPrice: costPrice,
          salePrice: salePrice,
          stock: stock
        });
      }
    });

    // Lưu variant vào localStorage
    localStorage.setItem('variants', JSON.stringify(variants));
  }

  // Đọc và hiển thị thuộc tính và variant khi tải lại trang
  window.onload = function() {
    // Lấy thuộc tính từ localStorage và hiển thị
    let attributes = JSON.parse(localStorage.getItem('attributes'));
    if (attributes && Array.isArray(attributes)) {
      attributes.forEach(function(attribute) {
        let attributeDiv = document.createElement('div');
        attributeDiv.classList.add('attribute');
        attributeDiv.innerHTML = `
          <input type="text" class="attribute-name" value="${attribute.name}" placeholder="Tên thuộc tính">
          <input type="text" class="attribute-value" value="${attribute.value}" placeholder="Giá trị thuộc tính">
        `;
        document.querySelector('.attribute-container').appendChild(attributeDiv);
      });
    }

    // Lấy variant từ localStorage và hiển thị
    let variants = JSON.parse(localStorage.getItem('variants'));
    if (variants && Array.isArray(variants)) {
      variants.forEach(function(variant) {
        let variantDiv = document.createElement('div');
        variantDiv.classList.add('variant');
        variantDiv.innerHTML = `
          <input type="text" class="variant-attribute-value" value="${variant.attributeValue}" placeholder="Giá trị thuộc tính">
          <input type="text" class="variant-product-code" value="${variant.productCode}" placeholder="Mã sản phẩm">
          <input type="number" class="variant-cost-price" value="${variant.costPrice}" placeholder="Giá vốn">
          <input type="number" class="variant-sale-price" value="${variant.salePrice}" placeholder="Giá bán">
          <input type="number" class="variant-stock" value="${variant.stock}" placeholder="Tồn kho">
        `;
        document.querySelector('.variant-container').appendChild(variantDiv);
      });
    }

    // Đảm bảo rằng dữ liệu nhập vào các trường thông thường cũng được duy trì
    if (localStorage.getItem('productName')) {
      document.getElementById('productName').value = localStorage.getItem('productName');
    }
    if (localStorage.getItem('category')) {
      document.getElementById('category').value = localStorage.getItem('category');
    }
    if (localStorage.getItem('brand')) {
      document.getElementById('brand').value = localStorage.getItem('brand');
    }
    if (localStorage.getItem('stock')) {
      document.getElementById('stock').value = localStorage.getItem('stock');
    }
    if (localStorage.getItem('weight')) {
      document.getElementById('weight').value = localStorage.getItem('weight');
    }
    if (localStorage.getItem('price')) {
      document.getElementById('price').value = localStorage.getItem('price');
    }
    if (localStorage.getItem('costPrice')) {
      document.getElementById('costPrice').value = localStorage.getItem('costPrice');
    }
  };

  // Lắng nghe sự kiện khi người dùng thay đổi thuộc tính hoặc variant
  document.querySelector('.attribute-container').addEventListener('input', saveAttributeData);
  document.querySelector('.variant-container').addEventListener('input', saveAttributeData);


