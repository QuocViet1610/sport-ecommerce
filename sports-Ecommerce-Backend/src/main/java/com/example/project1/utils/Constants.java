package com.example.project1.utils;

public class Constants {
    public static class EXPRESSION {

        public static final String CURRENT_DATE = "java(com.example.project1.utils.DateUtils.offSetDateNow())";

    }

    public interface REGEX {
        String EMAIL_PATTERN = "^([0-9a-zA-Z-.]+@[0-9a-zA-Z-.]+\\.[a-zA-Z]{2,9})$";
        String PHONE_PATTERN = "(0|84)?[1-9](\\d){8}";
        String USERNAME_PATTERN = "^[a-zA-Z0-9.\\-_]*$";
        String VEHICLE_PLATE_PATTERN = "^[0-9]{2}[a-zA-Z]{1,2}[0-9]{0,1}(([-][0-9]{4,5})|([0-9]{4,5})|[\\s+]([0-9]{4,5}))$";
        String FLOAT_PATTERN = "^[0-9]+(\\.[0-9]+ 691234780-`";
        String ALPHANUMERIC_SPACE_UNDERSCORE="^[\\p{L}0-9\\s_]+$";
        String TIME_PATTERN = "^([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d$";
    }
}
