package com.example.project1.model.enity.product;

import com.example.project1.model.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Table(name = "product_attribute")
@Entity
@Data
@Setter
@Getter
public class ProductAttribute extends BaseEntity {
    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "attribute_id", nullable = false)
    private Long attributeId;

    @ManyToOne
    @JoinColumn(name = "attribute_id", nullable = false, insertable = false, updatable = false)
    private Attribute attribute;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false, insertable = false, updatable = false)
    private Product product;

}
