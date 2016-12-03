package me.henuer.my2.service;

import me.henuer.my2.SpringNoTransactionTest;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.annotation.Resource;

/**
 * Created by Arron Zhang on 2016/11/12 23:32.
 */
public class KeyManagerTest extends SpringNoTransactionTest{
    private static final Logger logger = LoggerFactory.getLogger(KeyManagerTest.class);

    @Resource
    private KeyManager keyManager;

    @Test
    public void getFreshKey() throws Exception {
        int c = 123;
        {
            c = 456;
        }
        logger.debug("c={}", c);
    }

    @Test
    public void getSeniorKey() throws Exception {

    }

    @Test
    public void importKeys() throws Exception {
        keyManager.importKeys();
    }

}