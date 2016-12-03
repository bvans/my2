package me.henuer.my2.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.google.common.base.Splitter;
import com.google.common.collect.Sets;
import me.henuer.my2.util.JacksonUtil;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Set;

import static org.apache.http.HttpHeaders.USER_AGENT;

/**
 * Created by Arron Zhang on 2016/11/12 23:43.
 */
@Service
public class NetEaseCrawler {
    private static final Logger logger = LoggerFactory.getLogger(NetEaseCrawler.class);

    private static final String baseUrl = "http://mkey-phone.gm.163.com/cgi-bin/csa/csa_sprite.py?" +
            "act=ask&product_name=xyq&log_name=mkey&question=";

    @Value("fresh.key.answer")
    private String freshKeyTutorial;

    @Value("senior.key.answer")
    private String seniorKeyTutorial;

    @Value("keywords")
    private String keywords;

    @Value("default.answer")
    private String defaultAnswer;

    public String getAnswer(String question) throws IOException {
        question = question.trim();
        if (StringUtils.isBlank(question)) {
            return defaultAnswer;
        }

        if (getKeyWords().contains(question)) {
            //TODO

        }

        return getNormalAnswer(question);
    }


    private String getNormalAnswer(String question) throws IOException {
        String url = baseUrl + question;
        HttpClient client = HttpClientBuilder.create().build();
        HttpGet request = new HttpGet(url);
        request.addHeader(USER_AGENT, "User-Agent");
        HttpResponse response = client.execute(request);

        if (HttpStatus.SC_OK != response.getStatusLine().getStatusCode()) {
            logger.error("抓取官方信息失败!question={}", question);
            return defaultAnswer;
        }
        InputStream respIns = response.getEntity().getContent();
        //Charset charset = ContentType.getOrDefault(response.getEntity()).getCharset();
        //String json = IOUtils.toString(response.getEntity().getContent(), charset);
        JsonNode jsonRoot = JacksonUtil.getMapper().readTree(respIns);
        String result = jsonRoot.get("result").asText();
        String answerXML = jsonRoot.get("answer").asText();
        if(!"success".equalsIgnoreCase(result) || answerXML.contains("默认答案")) {
            logger.info("抓取官方信息失败或官方返回默认答案:question={},answer={}",question, answerXML);
        }
        return null;
    }

    private String processNormalAnswer(String answerXML) {
        return null;
    }


    private Set<String> getKeyWords() {
        if (StringUtils.isNotBlank(keywords)) {
            return Collections.emptySet();
        }
        Iterable<String> i = Splitter.on("\t")
                .omitEmptyStrings()
                .trimResults()
                .split(keywords);
        return Sets.newHashSet(i);
    }
}
