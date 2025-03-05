package com.example.project1.module.product.service.impl;

import com.example.project1.expection.ValidateException;
import com.example.project1.local.Translator;
import com.example.project1.mapper.product.CategoryMapper;
import com.example.project1.model.config.MinioConfig;
import com.example.project1.model.dto.product.CategoryDto;
import com.example.project1.model.dto.request.product.CategoryBaseRequest;
import com.example.project1.model.dto.request.product.CategoryCreateRequest;
import com.example.project1.model.dto.request.product.CategorySearchRequest;
import com.example.project1.model.enity.product.Category;
import com.example.project1.module.PageableCustom;
import com.example.project1.module.product.repository.CategoryRepository;
import com.example.project1.module.product.service.CategoryService;
import com.example.project1.utils.DataUtils;
import com.example.project1.utils.MinioUtils;
import com.example.project1.utils.SearchSpecificationUtil;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
//@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CategoryImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final MinioConfig minioConfig;
    private String bucketName ;
    private String folderLocal;
    private String keyName ;

    @PostConstruct
    void started() {
        bucketName = minioConfig.getMinioBucketName();
        keyName = minioConfig.getMinioCategoryKeyName();
        folderLocal = minioConfig.getMinioCategoryFolder();
    }

    private void validateLogic(CategoryCreateRequest request, boolean isCreated) {
        if (request.getParentId() != null) {
            Category parentCategory = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ValidateException(Translator.toMessage("Thể loại cha khong  tồn tại")));

            request.setLevel(parentCategory.getLevel() + 1);
        } else {
            request.setLevel(1L); // Mặc định là 1 nếu không có cha
        }

        if (isCreated) {
            if (categoryRepository.findByName(request.getName()).isPresent()) {
                throw new ValidateException(Translator.toMessage("Thể loại đã tồn tại"));
            }
        } else {
            if (categoryRepository.findByNameAndIdNot(request.getName(), request.getId()).isPresent()) {
                throw new ValidateException(Translator.toMessage("Thể loại đã tồn tại"));
            }
        }
    }

    @Override
    public void delete(Long id) {
        Category category = categoryRepository.findById(id).orElseThrow(() -> new ValidateException(Translator.toMessage("thể loại không tồn tại ")));
        MinioUtils.deleteFileMinio(bucketName, category.getImage());
        categoryRepository.delete(category);
    }

    @Override
    public Object search(CategorySearchRequest searchRequest, PageableCustom pageable) {
        Map<String, String> mapCondition = new HashMap<>();
        if (!DataUtils.isNullOrEmpty(searchRequest.getSearchText())) {
            mapCondition.put("name", searchRequest.getSearchText());
        }
            Specification<Category> conditions = Specification.where(SearchSpecificationUtil.<Category>alwaysTrue())
                    .and(SearchSpecificationUtil.or(mapCondition));
            if (!DataUtils.isNullOrEmpty(pageable) && !pageable.isFindAll()) {
                Page<Category> page = categoryRepository.findAll(conditions, pageable);
                return new PageImpl<>(page.getContent(), pageable, page.getTotalElements());
            }
            return categoryRepository.findAll(conditions, pageable.getSort());
        }

    @Override
    public CategoryDto create(CategoryBaseRequest request) {
        CategoryCreateRequest createRequest = request.getData();
        this.validateLogic(createRequest, true);
        if(!DataUtils.isNull(request.getImage())){
            createRequest.setImage(MinioUtils.uploadToMinioAndGetUrl(request.getImage(), folderLocal, bucketName, keyName));
        }
        Category category = categoryRepository.save(categoryMapper.toCreate(createRequest));
        return categoryMapper.toDto(category);
    }

    @Override
    public CategoryDto update(CategoryBaseRequest request, Long id) {
        return categoryRepository.findById(id).map(category -> {
            CategoryCreateRequest createRequest= request.getData();
            createRequest.setId(id);
            this.validateLogic(createRequest, false);
            if (!DataUtils.isNullOrEmpty(request.getImage())){
                createRequest.setImage(MinioUtils.uploadToMinioAndGetUrl(request.getImage(), folderLocal, bucketName, keyName));
                MinioUtils.deleteFileMinio(bucketName, category.getImage());
            }else {
                createRequest.setImage(category.getImage());
            }
            categoryMapper.partialUpdate(category, createRequest);
            categoryRepository.save(category);
            return categoryMapper.toDto(category);
        }).orElseThrow(() -> new ValidateException(Translator.toMessage("error.category.id.not_exist")));
    }
}