package com.example.project1.model.dto.product;

import com.example.project1.model.dto.BaseDto;
import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class ProductVariantDto {
    private Long id;

    private String code;

    private String name;

    private String image;

    private Long productId;

    private BigDecimal price;

    private BigDecimal costPrice;

    private Long quantity;
}
