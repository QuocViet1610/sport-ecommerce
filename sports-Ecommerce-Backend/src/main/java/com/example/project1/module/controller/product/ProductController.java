package com.example.project1.module.controller.product;

import com.example.project1.middleware.annotation.TrimAndValid;
import com.example.project1.model.dto.ResponseResult;
import com.example.project1.model.dto.product.ProductDto;
import com.example.project1.model.dto.request.product.ProductBaseRequest;
import com.example.project1.module.product.service.ProductService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductController {

     ProductService productService;


//    @PostMapping
//    public ResponseResult<ProductDto> createCategory(@RequestBody CategoryCreateRequest request) {
//        return ResponseResult.ofSuccess(categoryService.create(request));
//    }

    @RequestMapping(value = "", method = RequestMethod.POST, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseResult<ProductDto> create(@ModelAttribute @TrimAndValid ProductBaseRequest createRequest) {
        return ResponseResult.ofSuccess(productService.create(createRequest));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseResult<ProductDto> updateCategory(@PathVariable Long id, @ModelAttribute @TrimAndValid ProductBaseRequest request) {
        return ResponseResult.ofSuccess(productService.update(request, id));
    }

    @DeleteMapping("/{id}")
    public ResponseResult<Void> deleteCategory(@PathVariable Long id) {
        productService.delete(id);
        return ResponseResult.ofSuccess();
    }

//    @PostMapping("/search")
//    public ResponseResult<Object> search(@RequestBody @TrimAndValid CategorySearchRequest searchRequest,
//                                         @PathParam("page") int page,
//                                         @PathParam("size") int size,
//                                         @RequestParam(name="sort", required=false) List<String> sort) {
//        if (!DataUtils.isNullOrEmpty(page) && page >= 0) {
//            return ResponseResult.ofSuccess(productService.search(searchRequest, PageableCustom.setPageableCustom(page, size, sort)));
//        } else {
//            return ResponseResult.ofSuccess(productService.search(searchRequest, PageableCustom.setPageableCustom(0, size, sort,true)));
//        }
//    }


}
