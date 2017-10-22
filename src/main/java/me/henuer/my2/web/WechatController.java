package me.henuer.my2.web;

import static com.google.common.base.Preconditions.checkNotNull;

import java.util.Arrays;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.common.hash.Hashing;

import me.henuer.my2.service.CoreService;

/**
 * 微信校验 Created by Arron Zhang on 2016/11/12 23:42.
 */
@Controller
@RequestMapping("/wechat")
public class WechatController {
    private static final Logger logger = LoggerFactory.getLogger(WechatController.class);
    @Value("wechat.token")
    private String TOKEN = "yalong5945";

    @RequestMapping(value = "/my2", method = RequestMethod.GET)
    @ResponseBody
    public String processAuthentication(String signature, String timestamp, String nonce, String echostr) {
        logger.trace("receive request: signature={}, timestamp={}, nonce={}, echostr={}", signature, timestamp, nonce,
                echostr);
        checkNotNull(signature);
        checkNotNull(timestamp);
        checkNotNull(nonce);
        checkNotNull(echostr);

        String[] str = { TOKEN, timestamp, nonce };
        Arrays.sort(str); // 字典序排序
        String bigStr = str[0] + str[1] + str[2];
        // SHA1散列
        String digest = Hashing.sha1().hashBytes(bigStr.getBytes()).toString().toLowerCase();
        logger.info("digest={}", digest);
        if (digest.equals(signature)) {
            return echostr;
        } else {
            return "false";
        }
    }

    @RequestMapping(value = "/my22", method = RequestMethod.GET)
    @ResponseBody
    public String serve(HttpServletRequest request) {
        return CoreService.processRequest(request);
    }
}
