package com.example.project1.util;

import com.example.project1.model.Enum.LanguageEnum;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@RequiredArgsConstructor
public class TokenUtil {
    private final HttpServletRequest httpServletRequest;

    public String getLanguage(){
        String requestLangue = httpServletRequest.getHeader("Accept-language");
        if(requestLangue == null || requestLangue.isEmpty()){
            requestLangue = LanguageEnum.vi.name();
        }
        return requestLangue;
    }

    public static HttpServletRequest getCurrentRequest() {
        return ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
    }

}
