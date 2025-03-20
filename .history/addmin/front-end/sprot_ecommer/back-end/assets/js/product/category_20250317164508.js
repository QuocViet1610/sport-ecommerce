$(document).ready(function () {
  let currentPage = 1;
  let pageSize = 10;
  let totalPages = 1;

  function fetchData(page) {
      let token = localStorage.getItem("authToken"); // Lấy token từ localStorage (nếu có)
      $.ajax({
          url: `http://localhost:8080/category?page=${page - 1}&size=${pageSize}`, 
          type: "GET",
          contentType: "application/json",
          headers: {
              "Authorization": "Bearer " + token,
              "Accept": "application/json"
          },
          success: function (response) {
              if (response.code === "200") {
                  renderTable(response.data.content);
                  updatePagination(response.data);
              } else {
                  alert("Lỗi: " + response.message);
              }
          },
          error: function (xhr, status, error) {
              console.error("Lỗi khi lấy dữ liệu:", error);
          }
      });
  }

  function renderTable(data) {
    let tableBody = $(".product-group");
    tableBody.empty(); // Xóa dữ liệu cũ

    if (!Array.isArray(data) || data.length === 0) {
        tableBody.append("<tr><td colspan='4' class='text-center'>Không có dữ liệu</td></tr>");
        return;
    }

    data.forEach(item => {
        let imageSrc = item.image ? item.image : "assets/images/default-image.png";
        let row = `
            <tr>
                <td>
                    <div class="table-image">
                        <img src="${imageSrc}" class="img-fluid" alt="${item.categoryName}">
                    </div>
                </td>
                <td>${item.categoryName}</td>
                <td>${item.parentName ? item.parentName : "Không có"}</td>
                <td>
                    <ul>
                        <li><a href="#"><i class="ri-pencil-line"></i></a></li>
                        <li><a href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle">
                            <i class="ri-delete-bin-line"></i></a>
                        </li>
                    </ul>
                </td>
            </tr>
        `;
        tableBody.append(row);
    });
}


  function updatePagination(data) {
      totalPages = data.totalPages;
      $("#currentPageInput").val(currentPage);
      $("#paginationInfo").text(
          `${data.pageable.offset + 1} - ${data.pageable.offset + data.numberOfElements} trong ${data.totalElements} danh mục`
      );

      // Vô hiệu hóa nút phân trang khi cần
      $("#firstPage, #prevPage").prop("disabled", currentPage === 1);
      $("#nextPage, #lastPage").prop("disabled", currentPage === totalPages);
  }

  // Xử lý khi thay đổi trang
  $("#firstPage").click(() => { currentPage = 1; fetchData(currentPage); });
  $("#prevPage").click(() => { if (currentPage > 1) currentPage--; fetchData(currentPage); });
  $("#nextPage").click(() => { if (currentPage < totalPages) currentPage++; fetchData(currentPage); });
  $("#lastPage").click(() => { currentPage = totalPages; fetchData(currentPage); });

  // Xử lý khi thay đổi số dòng hiển thị
  $("#pageSizeSelect").change(function () {
      pageSize = parseInt($(this).val());
      currentPage = 1; // Reset về trang đầu
      fetchData(currentPage);
  });

  // Xử lý khi nhập trang và nhấn Enter
  $("#currentPageInput").keypress(function (e) {
      if (e.which === 13) { // Nếu nhấn Enter
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
