package me.henuer.my2.dao;

import me.henuer.my2.model.sn.SerialNum;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Created by Aaron on 2016/11/6.
 */
@Repository
public interface SerialNumDao {
    /**
     * 获取一个sn
     */
    String getValidSn(@Param("snType")int snType, @Param("snStatus")int snStatus);

    /**
     * 导入keys
     */
    long insertKeys(@Param("sn") List<SerialNum> sn);

    /**
     * 删除一个sn
     */
    long deleteBySn(@Param("sn") String sn);

}
