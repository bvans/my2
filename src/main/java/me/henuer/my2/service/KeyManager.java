package me.henuer.my2.service;

import static me.henuer.my2.util.DateUtil.yyyy_MM_dd;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import javax.annotation.Resource;

import me.henuer.my2.util.HttpUtil;
import me.henuer.my2.util.JacksonUtil;
import org.apache.commons.io.IOUtils;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.AbstractHttpClient;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.common.base.Charsets;
import com.google.common.base.Splitter;
import com.google.common.collect.Iterables;
import com.google.common.collect.Lists;
import com.google.common.io.Files;
import com.google.common.io.LineProcessor;

import me.henuer.my2.dao.SerialNumDao;
import me.henuer.my2.enums.SnStatus;
import me.henuer.my2.enums.SnType;
import me.henuer.my2.model.sn.SerialNum;
import me.henuer.my2.util.DateUtil;

/**
 * Created by Arron Zhang on 2016/11/12 23:03.
 */
@Service
public class KeyManager {
    private static final Logger logger = LoggerFactory.getLogger(KeyManager.class);
    private static final String REDIRECT_URL = "http://gs.163.com/s/n87ihd";
    private static final String FINAL_URL = "http://gs.163.com/app/acct_fab/apply/2/122/8822823";

    @Value("keys.filename")
    private String KEY_FILENAME;
    // @Resource
    private SerialNumDao serialNumDao;

    @Transactional
    public String getFreshKey() {
        String sn = serialNumDao.getValidSn(SnType.SN_FRESH.getCode(), SnStatus.SN_UNUSED.getCode());
        serialNumDao.deleteBySn(sn);
        return sn;
    }

    @Nullable
    public static String getSN() {
        CloseableHttpClient httpClient = HttpUtil.createClient();
        String result = null;
        try {
            httpClient.execute(new HttpGet(REDIRECT_URL));
            CloseableHttpResponse resp = httpClient.execute(new HttpPost(FINAL_URL));
            String content = IOUtils.toString(resp.getEntity().getContent());
            logger.info("get a sn:content={}", content);
            result = JacksonUtil.getMapper().readTree(content).get("data").asText();
        } catch (Throwable e) {
            logger.error("获取序列号失败", e);
        } finally {
            HttpUtil.close(httpClient);
        }
        return result;
    }

    @Transactional
    public String getSeniorKey() {
        String sn = serialNumDao.getValidSn(SnType.SN_SENIOR.getCode(), SnStatus.SN_UNUSED.getCode());
        serialNumDao.deleteBySn(sn);
        return sn;
    }

    @Transactional
    public long importKeys() throws Exception {
        String path = getClass().getResource('/' + KEY_FILENAME).getPath();
        List<SerialNum> sn = Files.readLines(new File(path), Charsets.UTF_8, new SnProcessor());
        logger.debug("sn={}", sn);
        return serialNumDao.insertKeys(sn);
    }

    class SnProcessor implements LineProcessor<List<SerialNum>> {
        private List<SerialNum> snList = Lists.newArrayList();

        @Override
        public boolean processLine(String line) throws IOException {
            Iterable<String> i = Splitter.on("\t").omitEmptyStrings().trimResults().split(line);
            snList.add(genSn(i));
            return true;
        }

        @Override
        public List<SerialNum> getResult() {
            return snList;
        }

        private SerialNum genSn(Iterable<String> i) {
            String[] attributes = Iterables.toArray(i, String.class);
            SerialNum sn = new SerialNum();

            if ("新手序列号".equalsIgnoreCase(attributes[0].trim())) {
                sn.setSnType(SnType.SN_FRESH);
            } else if ("老朋友序列号".equalsIgnoreCase(attributes[0].trim())) {
                sn.setSnType(SnType.SN_SENIOR);
            }

            sn.setSn(attributes[1]);

            if ("是".equalsIgnoreCase(attributes[2].trim())) {
                sn.setPromoPage(true);
            } else {
                sn.setPromoPage(false);
            }

            if ("未使用".equalsIgnoreCase(attributes[3].trim())) {
                sn.setSnStatus(SnStatus.SN_UNUSED);
            } else {
                sn.setSnStatus(SnStatus.SN_USED);
            }

            sn.setApplyDate(DateUtil.parse(attributes[4], yyyy_MM_dd).toDate());
            sn.setExpireDate(DateUtil.parse(attributes[5], yyyy_MM_dd).toDate());
            return sn;
        }
    }

    public static void main(String[] args) {
        String sn = getSN();
        System.out.println(sn);
    }
}
