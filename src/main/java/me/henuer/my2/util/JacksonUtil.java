package me.henuer.my2.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.google.common.collect.Lists;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Map;

/**
 * Created by qijiezhao on 16-2-15.
 */
public class JacksonUtil {
    private static final Logger logger = LoggerFactory.getLogger(JacksonUtil.class);

    private static final ObjectMapper mapper = new ObjectMapper();

    static {
        mapper.disable(SerializationFeature.INDENT_OUTPUT);
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.configure(JsonParser.Feature.ALLOW_BACKSLASH_ESCAPING_ANY_CHARACTER, true);
        mapper.configure(JsonParser.Feature.ALLOW_COMMENTS, true);
        mapper.configure(JsonParser.Feature.ALLOW_NON_NUMERIC_NUMBERS, true);
        mapper.configure(JsonParser.Feature.ALLOW_NUMERIC_LEADING_ZEROS, true);
        mapper.configure(JsonParser.Feature.ALLOW_SINGLE_QUOTES, true);
        mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);
        mapper.configure(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);

        mapper.setDateFormat(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"));
    }

    public static ObjectMapper getMapper() {
        return mapper;
    }

    public static String serialize(Object data) {
        try {
            return mapper.writeValueAsString(data);
        } catch (IOException e) {
            logger.error("serialize data error", e);
            return null;
        }
    }

    public static <T> T deSerialize(String content, TypeReference valueTypeRef) {
        try {
            return mapper.readValue(content, valueTypeRef);
        } catch (IOException e) {
            logger.error("deserialize object error: {}", content, e);
            return null;
        }
    }

    public static <T> T deSerialize(String content, Class<T> clazz) {
        try {
            return mapper.readValue(content, clazz);
        } catch (IOException e) {
            logger.error("deserialize object error: {}", content, e);
            return null;
        }
    }

    public static <T> Map<String, T> deSerializeMap(Class<String> clazeKey, Class<T> clazeValue, String content) {
        try {
            JavaType javaType = mapper.getTypeFactory().constructParametricType(Map.class, clazeKey, clazeValue);
            return mapper.readValue(content, javaType);
        } catch (IOException e) {
            logger.error("deserialize with java type object error: {}", content, e);
            return null;
        }
    }

    public static <T> List<T> deSerializeList(String content, Class<T> elementClasse) {
        JavaType javaType = mapper.getTypeFactory().constructParametricType(List.class, elementClasse);
        List<T> t = Lists.newArrayList();
        try {
            t = mapper.readValue(content, javaType);
        } catch (IOException e) {
            logger.error("deserialize with java type object error: {}", content, e);
        }
        return t;
    }

    public static <T> T convertValue(Object fromValue, Class<T> toValueType) {
        try {
            return mapper.convertValue(fromValue, toValueType);
        } catch (IllegalArgumentException e) {
            logger.error("convert object error: {}", fromValue.toString(), e);
            return null;
        }
    }

}
