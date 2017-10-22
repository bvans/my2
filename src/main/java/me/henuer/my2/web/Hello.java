package me.henuer.my2.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * Version: 1.0.0 Date:2017-10-22 Time: 17:13 Author: yalong.zhang
 */
@Controller
@RequestMapping("/test")
public class Hello {
    @ResponseBody
    @RequestMapping("/")
    public String test() {
        return "Hello!";
    }
}
