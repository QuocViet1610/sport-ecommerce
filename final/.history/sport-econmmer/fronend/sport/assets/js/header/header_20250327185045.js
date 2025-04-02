function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp * 1000;
        return Date.now() >= exp;
    } catch (e) {
        console.error("Token không hợp lệ:", e);
        return true;
    }
}

function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

$(document).ready(function () {
    const token = localStorage.getItem("authToken");
    const parentId = 1; 
    const parentIdNam = 2;
    const parentIdNu = 3;
    const parentIdKid = 4;
    const parentIdAssory = 5;
    if (!token) {
        showError("Bạn chưa đăng nhập!");
        return;
    } else if (isTokenExpired(token)) {
        showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
        localStorage.removeItem("authToken");
        return;
    }

    const decodedToken = parseJwt(token);
    const username = decodedToken.userName;
    localStorage.setItem('username', username);
    if (username) {
        document.getElementById('username').textContent = username;  
    } else {
        document.getElementById('username').textContent = "My Account"; 
    }

    const parentIds = [1, 2, 3, 4, 5]; 
    
    $.ajax({
        url: "http://localhost:8080/category",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function (res) {
            const data = res.data;
            parentIds.forEach(parentId => {
                const level2 = data.filter(cat => cat.level === 2 && findParent(cat, parentId));
                const level3 = data.filter(cat => cat.level === 3 && findParent(cat, parentId));
                let container;
    
                // Chọn container phù hợp dựa trên parentId
                switch (parentId) {
                    case 1:
                        container = $("#category-container");
                        break;
                    case 2:
                        container = $("#category-container-nam");
                        break;
                    case 3:
                        container = $("#category-container-nu");
                        break;
                    case 4:
                        container = $("#category-container-kid");
                        break;
                    case 5:
                        container = $("#category-container-accessory");
                        break;
                }
    
                level2.forEach(level2Cat => {
                    const col = $(`
                        <div class="col-xl-3">
                            <div class="dropdown-column m-0">
                                <h5 class="dropdown-header">
                                    <a href="shop-left-sidebar.html?id=${level2Cat.id}">
                                        ${level2Cat.name}
                                    </a>
                                </h5>
                            </div>
                        </div>
                    `);
    
                    const column = col.find(".dropdown-column");
    
                    level3
                        .filter(l3 => l3.parentId == level2Cat.id)
                        .forEach(item => {
                            const link = $(`
                                <a class="dropdown-item" href="shop-left-sidebar.html?id=${item.id}">
                                    ${item.name}
                                </a>
                            `);
                            column.append(link);
                        });
    
                    container.append(col);
                });
            });
        },
        error: function (err) {
            console.error("Lỗi khi gọi API:", err);
            showError("Không thể tải danh mục. Vui lòng thử lại sau!");
        }
    });
    
    // Hàm tìm parent
    function findParent(cat, parentId) {
        if (!cat.fullParentId) return false;
        return cat.fullParentId.split(",").includes(String(parentId));
    }
});