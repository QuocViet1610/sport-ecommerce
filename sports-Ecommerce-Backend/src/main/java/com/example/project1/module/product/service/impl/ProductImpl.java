package com.example.project1.module.product.service.impl;

import com.example.project1.expection.ValidateException;
import com.example.project1.local.Translator;
import com.example.project1.mapper.product.ProductMapper;
import com.example.project1.model.config.MinioConfig;
import com.example.project1.model.dto.product.ProductDto;
import com.example.project1.model.dto.request.product.ProductBaseRequest;
import com.example.project1.model.dto.request.product.ProductCreateRequest;
import com.example.project1.model.dto.request.product.ProductSearchRequest;
import com.example.project1.model.enity.product.Category;
import com.example.project1.model.enity.product.Product;
import com.example.project1.model.enity.product.ProductImage;
import com.example.project1.module.PageableCustom;
import com.example.project1.module.product.repository.*;
import com.example.project1.module.product.service.ProductService;
import com.example.project1.utils.DataUtils;
import com.example.project1.utils.MinioUtils;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductImpl implements ProductService {
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final MinioConfig minioConfig;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final GenderRepository genderRepository;
    private final ProductImageRepository productImageRepository;
    private String bucketName ;
    private String folderLocal;
    private String keyName ;

    @PostConstruct
    void started() {
        bucketName = minioConfig.getMinioBucketName();
        keyName = minioConfig.getMinioProductKeyName();
        folderLocal = minioConfig.getMinioProductFolder();
    }
    private void validateLogic(ProductCreateRequest request, boolean isCreated) {
        Optional<Category> category = categoryRepository.findById(request.getCategoryId());

        if (category.isEmpty()) {
            throw new ValidateException(Translator.toMessage("Thể loại khong ton tai"));
        }

        if (request.getBrandId() == null){
        if (brandRepository.findById(request.getBrandId()).isEmpty()) {
            throw new ValidateException(Translator.toMessage("Thuong hieu khong ton tai"));
        }
        }
        if (genderRepository.findById(request.getGenderId()).isEmpty()) {
            throw new ValidateException(Translator.toMessage("doi tuong khong ton tai"));
        }
        if (request.getWeight() == null){
            request.setWeight(BigDecimal.ZERO);
        }
        if (isCreated) {
            if (productRepository.findByName(request.getName()).isPresent()) {
                throw new ValidateException(Translator.toMessage("Sản phẩm đã tồn tại "));
            }
            request.setCode(DataUtils.createCodeByKey(request.getName()));
        } else {
            if (productRepository.findByNameAndIdNot(request.getName(), request.getId()).isPresent()) {
                throw new ValidateException(Translator.toMessage("Sản phẩm đã tồn tại "));
            }
        }
    }

    @Override
    public void delete(Long id) {

    }

    @Override
    public Object search(ProductSearchRequest searchRequest, PageableCustom pageable) {
        return null;
    }

    @Override
    public ProductDto create(ProductBaseRequest request) {
        ProductCreateRequest createRequest = request.getData();
        this.validateLogic(createRequest, true);
        if (request.getImage() != null && request.getImage().size() > 5) {
            throw new ValidateException("Bạn chỉ có thể tải lên tối đa 5 ảnh.");
        }
        Product product = productRepository.save(productMapper.toCreate(createRequest));
        saveProductImages(request.getImage(), product);

        return productMapper.toDto(product);
    }

    private void saveProductImages(List<MultipartFile> images, Product product) {
        if (!DataUtils.isNull(images)) {
            List<ProductImage> productImages = images.stream().map(image -> {
                ProductImage productImage = new ProductImage();
                productImage.setImageUrl(MinioUtils.uploadToMinioAndGetUrl(image, folderLocal, bucketName, keyName));
                productImage.setProductId(product.getId());
                return productImage;
            }).collect(Collectors.toList());
            productImageRepository.saveAll(productImages);
        }
    }
    @Override
    public ProductDto update(ProductBaseRequest request, Long id) {
        return null;
    }
}
