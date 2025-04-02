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

$(document).ready(function () {
    const token = localStorage.getItem("authToken");
    const parentId = 1; // ID cha cần load (ví dụ: Môn Thể Thao)
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

    $.ajax({
        url: "http://localhost:8080/category",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function (res) {
            const data = res.data;
            const level2 = data.filter(cat => cat.level === 2 && findParent(cat, parentId));
            const level3 = data.filter(cat => cat.level === 3 && findParent(cat, parentId));
            const container = $("#category-container");

            level2.forEach(level2Cat => {
                const col = $(`
                    <div class="col-xl-2">
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
        },
        error: function (err) {
            console.error("Lỗi khi gọi API:", err);
            showError("Không thể tải danh mục. Vui lòng thử lại sau!");
        }
    });

    $.ajax({
        url: "http://localhost:8080/category",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function (res) {
            const data = res.data;
            const level2 = data.filter(cat => cat.level === 2 && findParent(cat, parentIdNam));
            const level3 = data.filter(cat => cat.level === 3 && findParent(cat, parentIdNam));
            const container = $("#category-container-nam");

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
        },
        error: function (err) {
            console.error("Lỗi khi gọi API:", err);
            showError("Không thể tải danh mục. Vui lòng thử lại sau!");
        }
    });
    $.ajax({
        url: "http://localhost:8080/category",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function (res) {
            const data = res.data;
            const level2 = data.filter(cat => cat.level === 2 && findParent(cat, parentIdNu));
            const level3 = data.filter(cat => cat.level === 3 && findParent(cat, parentIdNu));
            const container = $("#category-container-nu");

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
        },
        error: function (err) {
            console.error("Lỗi khi gọi API:", err);
            showError("Không thể tải danh mục. Vui lòng thử lại sau!");
        }
    });

    $.ajax({
        url: "http://localhost:8080/category",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function (res) {
            const data = res.data;
            const level2 = data.filter(cat => cat.level === 2 && findParent(cat, parentIdKid));
            const level3 = data.filter(cat => cat.level === 3 && findParent(cat, parentIdKid));
            const container = $("#category-container-kid");

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
        },
        error: function (err) {
            console.error("Lỗi khi gọi API:", err);
            showError("Không thể tải danh mục. Vui lòng thử lại sau!");
        }
    });

    $.ajax({
        url: "http://localhost:8080/category",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token,
            "Accept": "application/json"
        },
        success: function (res) {
            const data = res.data;
            const level2 = data.filter(cat => cat.level === 2 && findParent(cat, parentIdAssory));
            const level3 = data.filter(cat => cat.level === 3 && findParent(cat, parentIdAssory));
            const container = $("#category-container-accessory");

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
        },
        error: function (err) {
            console.error("Lỗi khi gọi API:", err);
            showError("Không thể tải danh mục. Vui lòng thử lại sau!");
        }
    });
    function findParent(cat, parentId) {
        if (!cat.fullParentId) return false;
        return cat.fullParentId.split(",").includes(String(parentId));
    }
});