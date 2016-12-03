package me.henuer.my2.enums;

import org.jetbrains.annotations.Nullable;

/**
 * Created by Aaron Zhang on 2016/11/6.
 */
public enum SnStatus implements CodeEnum {
    SN_UNUSED(0, "未使用"),
    SN_USED(1, "已使用");

    private Integer code;
    private String desc;

    SnStatus(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @Override
    public int getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

    @Nullable
    public static SnStatus getInstance(String desc) {
        SnStatus[] values = SnStatus.values();
        for(SnStatus ins : values) {
            if(ins.desc.equalsIgnoreCase(desc)) {
                return ins;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return code.toString();
    }

}

