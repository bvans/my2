package me.henuer.my2.util;

import org.joda.time.DateTime;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;

/**
 * Created by Arron Zhang on 2016/11/12 21:31.
 */
public class DateUtil {
    public static final DateTimeFormatter yyyy_MM_dd = DateTimeFormat.forPattern("yyyy-MM-dd HH:mm:ss");

    public static DateTime parse(String dateTime, DateTimeFormatter formatter) {
        return formatter.parseDateTime(dateTime);
    }
}
