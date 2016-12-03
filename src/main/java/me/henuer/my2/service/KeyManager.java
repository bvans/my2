package me.henuer.my2.service;

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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import me.henuer.my2.util.DateUtil;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.util.List;

import static me.henuer.my2.util.DateUtil.yyyy_MM_dd;

/**
 * Created by Arron Zhang on 2016/11/12 23:03.
 */
@Service
public class KeyManager {
    private static final Logger logger = LoggerFactory.getLogger(KeyManager.class);

    @Value("keys.filename")
    private String KEY_FILENAME;
    @Resource
    private SerialNumDao serialNumDao;

    @Transactional
    public String getFreshKey() {
        String sn = serialNumDao.getValidSn(SnType.SN_FRESH.getCode(), SnStatus.SN_UNUSED.getCode());
        serialNumDao.deleteBySn(sn);
        return sn;
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
            Iterable<String> i = Splitter.on("\t")
                    .omitEmptyStrings()
                    .trimResults()
                    .split(line);
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
}
