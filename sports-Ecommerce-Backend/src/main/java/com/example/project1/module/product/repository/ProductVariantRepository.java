package com.example.project1.module.product.repository;

import com.example.project1.model.enity.product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

}
