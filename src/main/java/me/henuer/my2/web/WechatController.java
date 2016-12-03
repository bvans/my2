package me.henuer.my2.web;

import com.google.common.base.Stopwatch;
import me.henuer.my2.util.SHA1;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.annotation.PostConstruct;
import java.util.Arrays;

import static com.google.common.base.Preconditions.checkNotNull;

/**
 * Created by Arron Zhang on 2016/11/12 23:42.
 */
@Controller
@RequestMapping("/wechat")
public class WechatController {
    private static final Logger logger = LoggerFactory.getLogger(WechatController.class);
    @Value("wechat.token")
    private String TOKEN;

    @PostConstruct
    public void init() {
        System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    }

    @RequestMapping("/my2")
    //@ResponseBody
    public String processAuthentication(String signature, String timestamp, String nonce, String echostr) {
        Stopwatch watch = Stopwatch.createStarted();
        logger.info("receive request: signature={}, timestapm={}, nonce={}, echostr={}",
                signature, timestamp, nonce, echostr);
        checkNotNull(signature);
        checkNotNull(timestamp);
        checkNotNull(nonce);
        checkNotNull(echostr);

        String[] str = { TOKEN, timestamp, nonce };
        Arrays.sort(str); // 字典序排序
        String bigStr = str[0] + str[1] + str[2];
        // SHA1加密
        String digest = new SHA1().getDigestOfString(bigStr.getBytes())
                .toLowerCase();
        logger.info("response={}, time={}", digest, watch);
        return "index";
        //return digest;
    }
}
