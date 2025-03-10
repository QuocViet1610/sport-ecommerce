package com.example.project1.module.product.service;

import com.example.project1.model.dto.product.BrandDto;
import com.example.project1.model.dto.product.ProductDto;
import com.example.project1.model.dto.request.product.BrandBaseRequest;
import com.example.project1.model.dto.request.product.BrandSearchRequest;
import com.example.project1.model.dto.request.product.ProductBaseRequest;
import com.example.project1.model.dto.request.product.ProductSearchRequest;
import com.example.project1.module.PageableCustom;

public interface ProductService {

    void delete(Long id);
    Object search(ProductSearchRequest searchRequest, PageableCustom pageable);
    ProductDto create(ProductBaseRequest request);
    public ProductDto update(ProductBaseRequest request, Long id) ;

}
