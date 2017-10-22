package me.henuer.my2;

import org.apache.commons.io.IOUtils;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.io.InputStream;

/**
 * Version: 1.0.0 Date:2016-12-18 Time: 21:35 Author: yalong.zhang
 */
public class HttpTest {
    private static final Logger logger = LoggerFactory.getLogger(HttpTest.class);

    private static  final String UA   = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36";

    public static void main(String[] args) {
        String url = "http://gs.163.com/s/n87ihd";
        CloseableHttpClient httpClient = HttpClients.createDefault();
        HttpGet httpGet = new HttpGet(url);
        httpGet.addHeader("User-Agent", UA);
        try {
            CloseableHttpResponse httpResponse = httpClient.execute(httpGet);
            logger.info("code:{}", httpResponse.getStatusLine().getStatusCode());
            InputStream content = httpResponse.getEntity().getContent();
            String result = IOUtils.toString(content);
            logger.info("result={}", result);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
