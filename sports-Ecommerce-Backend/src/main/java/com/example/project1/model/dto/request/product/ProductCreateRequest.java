package com.example.project1.model.dto.request.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductCreateRequest {
    private Long id;
    private String code;

    @NotBlank(message = "error.product.name.required")
    @Size(min = 3, max = 255, message = "error.product.name.size")
    private String name;

    @NotNull(message = "error.product.categoryId.required")
    private Long categoryId;

    @NotNull(message = "error.product.price.required")
    @Positive(message = "error.product.price.positive")
    private BigDecimal price;

    @NotNull(message = "error.product.costPrice.required")
    @Positive(message = "error.product.costPrice.positive")
    private BigDecimal costPrice;


    private String description;

    private Integer isActive;
    private Long brandId;
    private Long supplierId;
    @NotNull(message = "error.product.genderId.required")
    private Long genderId;
    private Long totalSold;
    private BigDecimal totalRating;
    @Positive(message = "error.product.stock.positive")
    private Long stock;
    private BigDecimal discountPrice;

    @Positive(message = "error.product.weight.positive")
    private BigDecimal weight;
}
