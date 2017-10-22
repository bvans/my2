package me.henuer.my2.util;

import java.io.IOException;

import org.apache.http.client.config.RequestConfig;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Version: 1.0.0 Date:2017-01-01 Time: 20:20 Author: yalong.zhang
 */
public class HttpUtil {
    private static final Logger logger = LoggerFactory.getLogger(HttpUtil.class);
    private static final String UA = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";

    public static CloseableHttpClient createClient() {
        RequestConfig reqConfig = RequestConfig.custom().setConnectTimeout(100).setSocketTimeout(1000).build();
        return HttpClients.custom().setUserAgent(UA).setDefaultRequestConfig(reqConfig).build();
    }

    public static void close(CloseableHttpClient httpClient) {
        if (httpClient == null)
            return;
        try {
            httpClient.close();
        } catch (IOException e) {
            logger.error("http client failed to close!", e);
        }
    }
}
