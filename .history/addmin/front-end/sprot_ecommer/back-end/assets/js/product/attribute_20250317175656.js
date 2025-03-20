$(document).ready(function () {
  function isTokenExpired(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decode phần payload của JWT
        const exp = payload.exp * 1000; // Chuyển từ giây sang milliseconds

        return Date.now() >= exp; // Kiểm tra nếu token đã hết hạn
    } catch (e) {
        console.error("Token không hợp lệ:", e);
        return true; // Mặc định là hết hạn nếu có lỗi
    }
}

let token = localStorage.getItem("authToken");

if (!token) {
    showError("Bạn chưa đăng nhập!");
    return; 
} else if (isTokenExpired(token)) {
    showError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
    localStorage.removeItem("authToken"); // Xóa token cũ
} else {
    
}
  let currentPage = 1;
  let pageSize = 5;
  let totalPages = 1;
  let searchRequest = { searchText: "" };

  let typingTimer;
  const typingDelay = 500;

  // Xử lý sự kiện nhập tìm kiếm (Live Search)
  $("#searchInput").on("input", function () {
    clearTimeout(typingTimer);
    let searchText = $(this).val().trim();
    searchRequest.searchText = searchText;
    console.log("aa")
    // Đợi `typingDelay` ms trước khi gọi API (tránh spam)
    typingTimer = setTimeout(() => {
      currentPage = 1; // Reset về trang đầu khi tìm kiếm
      fetchData(currentPage);
    }, typingDelay);
  });

  // Gửi yêu cầu AJAX để lấy dữ liệu
  function fetchData(page) {
    let token = localStorage.getItem("authToken");

    $.ajax({
      url: `http://localhost:8080/attribute/search?page=${page - 1}&size=${pageSize}&sort=id.asc`,
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify(searchRequest),
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
      },
      success: function (response) {
        if (response.code === "200" && response.data) {
          renderTable(response.data.content);
          updatePagination(response.data);
        } else {
          $(".product-group").html("<tr><td colspan='4' class='text-center'>Không có dữ liệu</td></tr>");
        }
      },
      error: function (xhr, status, error) {
        let errorMessage = "Đã xảy ra lỗi!";
        if (xhr.responseJSON && xhr.responseJSON.message) {
          errorMessage = xhr.responseJSON.message;
        } else if (xhr.responseText) {
          try {
            let response = JSON.parse(xhr.responseText);
            errorMessage = response.message || "Lỗi không xác định từ máy chủ!";
          } catch (e) {
            errorMessage = "Lỗi không thể đọc phản hồi từ server!";
          }
        } else {
          errorMessage = "Lỗi mạng hoặc máy chủ không phản hồi!";
        }
        console.error("Lỗi khi lấy dữ liệu:", errorMessage);
        showError(errorMessage);
      }
    });
  }

  // Hiển thị dữ liệu vào bảng
  function renderTable(data) {
    let tableBody = $(".product-group");
    tableBody.empty();

    if (!Array.isArray(data) || data.length === 0) {
        tableBody.append("<tr><td colspan='3' class='text-center'>Không có dữ liệu</td></tr>");
        return;
    }

    data.forEach(item => {
        let valuesText = item.values.length > 0 ? item.values.map(v => v.name).join(", ") : "Không có giá trị";
        let row = `
            <tr>
                <td>${item.name}</td>
                <td>${valuesText}</td>
                <td>
                    <ul>
                        <li><a href="#" class="edit-btn" data-id="${item.id}"><i class="ri-pencil-line"></i></a></li>
                        <li><a href="#" class="delete-btn" data-id="${item.id}" data-name="${item.name}" data-bs-toggle="modal" data-bs-target="#deleteModal">
                            <i class="ri-delete-bin-line"></i></a>
                        </li>
                    </ul>
                </td>
            </tr>
        `;
        tableBody.append(row);
    });
}

  // Cập nhật phân trang
  function updatePagination(data) {
    if (!data.pageable) {
      console.error("Dữ liệu phân trang không hợp lệ:", data);
      $("#paginationInfo").text("Không có dữ liệu");
      return;
    }

    totalPages = data.totalPages;
    $("#currentPageInput").val(currentPage);

    let offset = data.pageable.offset ? data.pageable.offset : 0;
    let numberOfElements = data.numberOfElements ? data.numberOfElements : 0;
    let totalElements = data.totalElements ? data.totalElements : 0;

    $("#paginationInfo").text(
      `${offset + 1} - ${offset + numberOfElements} trong ${totalElements} danh mục`
    );

    // Cập nhật trạng thái nút phân trang
    $("#firstPage, #prevPage").prop("disabled", currentPage === 1);
    $("#nextPage, #lastPage").prop("disabled", currentPage === totalPages);
  }

  // Xử lý sự kiện thay đổi trang
  $("#firstPage").click(() => { currentPage = 1; fetchData(currentPage); });
  $("#prevPage").click(() => { if (currentPage > 1) currentPage--; fetchData(currentPage); });
  $("#nextPage").click(() => { if (currentPage < totalPages) currentPage++; fetchData(currentPage); });
  $("#lastPage").click(() => { currentPage = totalPages; fetchData(currentPage); });

  // Xử lý khi thay đổi số dòng hiển thị
  $("#pageSizeSelect").change(function () {
    pageSize = parseInt($(this).val());
    currentPage = 1;
    fetchData(currentPage);
  });

  // Xử lý khi nhập trang và nhấn Enter
  $("#currentPageInput").keypress(function (e) {
    if (e.which === 13) {
      let pageInput = parseInt($(this).val());
      if (pageInput >= 1 && pageInput <= totalPages) {
        currentPage = pageInput;
        fetchData(currentPage);
      } else {
        alert("Số trang không hợp lệ!");
      }
    }
  });

  // Gọi API lần đầu khi trang tải
  fetchData(currentPage);
});
