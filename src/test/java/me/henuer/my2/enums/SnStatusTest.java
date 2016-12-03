package me.henuer.my2.enums;

import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Created by Aaron on 2016/11/6.
 */
public class SnStatusTest {
    private static Logger logger = LoggerFactory.getLogger(SnStatusTest.class);

    @Test
    public void getCode() throws Exception {
        logger.debug("code={}", SnStatus.SN_UNUSED.getCode());
    }

}