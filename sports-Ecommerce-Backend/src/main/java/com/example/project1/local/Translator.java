package com.example.project1.local;

import com.example.project1.util.TokenUtil;
import org.springframework.context.MessageSource;
import org.springframework.context.support.ResourceBundleMessageSource;
import org.springframework.stereotype.Component;
import java.util.Locale;

@Component
public class Translator {

    private static final MessageSource messageSource;

    static {
        ResourceBundleMessageSource msgSource = new ResourceBundleMessageSource();
        msgSource.setBasename("i18n/messages");
        msgSource.setDefaultEncoding("UTF-8");
        messageSource = msgSource;
    }

    private static TokenUtil tokenUtil;

    // Phương thức tiêm TokenUtil
    public Translator(TokenUtil tokenUtil) {
        Translator.tokenUtil = tokenUtil; // Gán TokenUtil vào biến tĩnh
    }

    public static String toMessage(String keyMessage) {
        // Lấy ngôn ngữ từ TokenUtil thông qua phương thức tĩnh
        String language = tokenUtil != null ? tokenUtil.getLanguage() : "vi"; // Ngôn ngữ mặc định là "vi"
        Locale locale = Locale.forLanguageTag(language != null ? language : "vi"); // Ngôn ngữ mặc định là "vi"
        return messageSource.getMessage(keyMessage, null, locale);
    }
}
