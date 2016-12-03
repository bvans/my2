package me.henuer.my2.dao;

import me.henuer.my2.SpringNoTransactionTest;
import me.henuer.my2.enums.SnStatus;
import me.henuer.my2.enums.SnType;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;

/**
 * Created by Arron Zhang on 2016/11/12 20:04.
 */
public class SerialNumDaoTest extends SpringNoTransactionTest {
    private static final Logger logger = LoggerFactory.getLogger(SerialNumDaoTest.class);

    @Resource
    private SerialNumDao serialNumDao;

    @Test
    public void getValidSn() throws Exception {
        String sn = serialNumDao.getValidSn(SnType.SN_FRESH.getCode(), SnStatus.SN_UNUSED.getCode());
        long line = serialNumDao.deleteBySn(sn);
        logger.debug("line={}", line);
    }


    @Test
    public void insertKeys() throws Exception {

    }


}