package com.example.project1.module.product.service;

import com.example.project1.model.dto.product.CategoryDto;
import com.example.project1.model.dto.request.product.CategoryBaseRequest;
import com.example.project1.model.dto.request.product.CategorySearchRequest;
import com.example.project1.module.PageableCustom;

public interface CategoryService {
    void delete(Long id);

    Object search(CategorySearchRequest searchRequest, PageableCustom pageable);
    CategoryDto create(CategoryBaseRequest request);
    public CategoryDto update(CategoryBaseRequest request, Long id) ;
}
