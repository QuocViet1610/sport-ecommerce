package com.example.project1.util;

import java.time.OffsetDateTime;

public class DateUtils {

    public static OffsetDateTime offSetDateNow() {
        return OffsetDateTime.now();
    }

    public static String timeServerNow() {
        return offSetDateNow().toString();
    }


}
