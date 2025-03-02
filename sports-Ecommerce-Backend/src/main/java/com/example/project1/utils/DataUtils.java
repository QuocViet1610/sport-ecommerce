package com.example.project1.utils;

import com.example.project1.middleware.annotation.Nested;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ReflectionUtils;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
public class DataUtils {

    public static void trimValues(Object model) {
        List<Field> allField = Arrays.stream(model.getClass().getDeclaredFields()).collect(Collectors.toList());
        if (model.getClass().getSuperclass() != null) {
            List<Field> allFieldParent = Arrays.stream(model.getClass().getSuperclass().getDeclaredFields()).collect(Collectors.toList());
            allField.addAll(allFieldParent);
        }
        for (Field field : allField) {
            try {
                field.setAccessible(true);
                Object value = field.get(model);
                if (value != null) {
                    if (value instanceof String) {
                        String strValue = (String) value;
                        field.set(model, strValue.trim());
                    }else if(value instanceof List){
                        try{
                            List<String> strings = (List<String>) value;
                            strings = strings.stream().map(String::trim).collect(Collectors.toList());
                            field.set(model, strings);
                        }catch (Exception e){

                        }
                    }
                }
            } catch (IllegalAccessException e) {
                log.error(e.getMessage(), e);
            }
        }
    }

    public static void trimNested(Object nestedObject) {
        if (nestedObject != null) {
            DataUtils.trimValues(nestedObject);
            Field[] fields = nestedObject.getClass().getDeclaredFields();
            for (Field field : fields) {
                Annotation[] annotations = field.getDeclaredAnnotations();
                for (Annotation annotation : annotations) {
                    if (annotation instanceof Nested) {
                        Nested nested = (Nested) annotation;
                        field.setAccessible(true);
                        if (nested.isCollection()) {
                            Collection<Object> collection = (Collection<Object>) ReflectionUtils.getField(field, nestedObject);
                            if (collection != null)
                                collection.forEach(DataUtils::trimNested);
                        } else {
                            Object value = ReflectionUtils.getField(field, nestedObject);
                            if (value != null) {
                                DataUtils.trimValues(value);
                                trimNested(value);
                            }
                        }
                    }
                }
            }
        }
    }

    public static <T> List<String> validate(T obj) {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        Validator validator = factory.getValidator();
        Set<ConstraintViolation<T>> violations = validator.validate(obj);
        if (!CollectionUtils.isEmpty(violations)) {
            return violations.stream().map(ConstraintViolation::getMessage).collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}
