package com.example.project1.model.enity.product;

import com.example.project1.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Table(name = "product_variants")
@Entity
@Data
@Setter
@Getter
public class ProductVariant extends BaseEntity {
    @Column(nullable = false, unique = true, length = 255)
    private String code;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "cost_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal costPrice;

    @Column(name = "price_old", precision = 10, scale = 2)
    private BigDecimal priceOld;

    @Column(nullable = false)
    private Integer quantity;

    @OneToMany(mappedBy = "productVariant", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductVariantAttribute> variantAttributes;
}
