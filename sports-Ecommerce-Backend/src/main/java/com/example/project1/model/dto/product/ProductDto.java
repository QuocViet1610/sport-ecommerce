package com.example.project1.model.dto.product;

import com.example.project1.model.dto.BaseDto;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductDto extends BaseDto {

    private String code;

    private String name;

    private Long categoryId;

    private BigDecimal price;

    private BigDecimal costPrice;

    private String description;

    private Integer isActive;

    private Long brandId;

    private Long supplierId;

    private Long genderId;

    private Long totalSold;

    private BigDecimal totalRating;

    private Long stock;

    private BigDecimal discountPrice;

    private BigDecimal weight;

}
