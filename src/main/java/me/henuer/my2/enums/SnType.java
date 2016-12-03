package me.henuer.my2.enums;

import org.jetbrains.annotations.Nullable;

/**
 * Created by Aaron on 2016/11/6.
 */
public enum SnType  implements CodeEnum {
    SN_FRESH(0, "新手序列号"), SN_SENIOR(1, "老玩家序列号");
    
    int code;
    String desc;
    SnType(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Nullable
    public static SnType getInstance(String desc) {
        SnType[] values = SnType.values();
        for(SnType ins : values) {
            if(ins.desc.equalsIgnoreCase(desc)) {
                return ins;
            }
        }
        return null;
    }

    @Override
    public String toString() {
        return this.desc;
    }
}
