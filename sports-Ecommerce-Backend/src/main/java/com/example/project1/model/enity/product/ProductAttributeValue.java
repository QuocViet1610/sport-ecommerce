package com.example.project1.model.enity.product;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Table(name = "product_attribute_value")
@Entity
@Data
@Setter
@Getter
public class ProductAttributeValue  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "attribute_value_id", nullable = false)
    private Long attributeValueId;

    @ManyToOne
    @JoinColumn(name = "attribute_value_id", nullable = false, insertable = false, updatable = false)
    private Attribute attributeValue;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false, insertable = false, updatable = false)
    private Product product;

}
