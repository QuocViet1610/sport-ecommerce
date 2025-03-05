package com.example.project1.model.dto.request.product;

import lombok.Data;

@Data
public class CategoryCreateRequest {
    private Long id;
    private String name;
    private Long parentId;
    private String fullParentId;
    private String image;
    private Long level;
}
