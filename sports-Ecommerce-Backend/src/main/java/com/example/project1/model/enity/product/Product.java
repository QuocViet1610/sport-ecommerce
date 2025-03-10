package com.example.project1.model.enity.product;

import com.example.project1.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Table(name = "product")
@Entity
@Data
@Setter
@Getter
public class Product extends BaseEntity {

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "cost_price")
    private BigDecimal costPrice;

    @Column(name = "description")
    private String description;

    @Column(name = "is_active")
    private Integer isActive;

    @Column(name = "brand_id")
    private Long brandId;

    @Column(name = "supplier_id")
    private Long supplierId;

    @Column(name = "gender_id")
    private Long genderId;

    @Column(name = "total_sold")
    private Long totalSold;

    @Column(name = "total_rating")
    private BigDecimal totalRating;

    @Column(name = "stock")
    private Long stock;

    @Column(name = "discount_price")
    private BigDecimal discountPrice;

    @Column(name = "weight")
    private BigDecimal weight;
}
