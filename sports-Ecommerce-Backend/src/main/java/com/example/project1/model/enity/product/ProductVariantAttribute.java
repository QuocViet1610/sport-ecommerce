package com.example.project1.model.enity.product;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Table(name = "product_variants")
@Entity
@Data
@Setter
@Getter
public class ProductVariantAttribute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "product_variant_id", nullable = false)
    private Long productVariantId;

    @Column(name = "attribute_value_id", nullable = false)
    private Long attributeValueId;

    @ManyToOne
    @JoinColumn(name = "product_variant_id", nullable = false, insertable = false, updatable = false)
    private ProductVariant productVariant;

    @ManyToOne
    @JoinColumn(name = "attribute_value_id", nullable = false, insertable = false, updatable = false)
    private AttributeValue attributeValue;
}
