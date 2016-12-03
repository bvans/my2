package me.henuer.my2.model.sn;

import me.henuer.my2.enums.SnStatus;
import me.henuer.my2.enums.SnType;

import java.util.Date;

/**
 * Created by Aaron on 2016/11/6.
 */
public class SerialNum {
    private Integer id;
    private SnType snType;
    private String sn;
    private boolean promoPage;
    private SnStatus snStatus;
    private Date applyDate;
    private Date expireDate;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public SnType getSnType() {
        return snType;
    }

    public void setSnType(SnType snType) {
        this.snType = snType;
    }

    public String getSn() {
        return sn;
    }

    public void setSn(String sn) {
        this.sn = sn;
    }

    public boolean isPromoPage() {
        return promoPage;
    }

    public void setPromoPage(boolean promoPage) {
        this.promoPage = promoPage;
    }

    public SnStatus getSnStatus() {
        return snStatus;
    }

    public void setSnStatus(SnStatus snStatus) {
        this.snStatus = snStatus;
    }

    public Date getApplyDate() {
        return applyDate;
    }

    public void setApplyDate(Date applyDate) {
        this.applyDate = applyDate;
    }

    public Date getExpireDate() {
        return expireDate;
    }

    public void setExpireDate(Date expireDate) {
        this.expireDate = expireDate;
    }

    @Override
    public String toString() {
        return "SerialNum{" +
                "id=" + id +
                ", snType=" + snType +
                ", sn='" + sn + '\'' +
                ", promoPage=" + promoPage +
                ", snStatus=" + snStatus +
                ", applyDate=" + applyDate +
                ", expireDate=" + expireDate +
                '}';
    }
}

