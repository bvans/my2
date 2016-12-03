package me.henuer.my2.enums;

import org.apache.ibatis.builder.xml.XMLConfigBuilder;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.jetbrains.annotations.NotNull;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import static com.google.common.base.Preconditions.checkNotNull;

/**
 * 通用枚举处理
 * <p>
 *     枚举需要实现CodeEnum接口
 * <p/>
 * 在mybatis-config.xml中配置如下:
 * <pre>
 * &lt;typeHandlers&gt;
 *     &lt;typeHandler javaType=".....XXXEnum" handler="me.henuer.my2.enums.CodeEnumTypeHandler" /&gt;
 * &lt;/typeHandlers&gt;
 * </pre>
 * <p>
 * TypeHandler初始化参考{@link XMLConfigBuilder}中方法typeHandlerElement
 *
 * @author zhongyuan.zhang
 */
@SuppressWarnings("rawtypes")
public class CodeEnumTypeHandler extends BaseTypeHandler<CodeEnum> {
    private Class<CodeEnum> type;

    public CodeEnumTypeHandler(@NotNull Class<CodeEnum> enumType) {
        checkNotNull(enumType);
        this.type = enumType;
    }



    private CodeEnum convert(int status) {
        CodeEnum[] enums = type.getEnumConstants();
        for(CodeEnum e : enums) {
            if(e.getCode() == status) {
                return e;
            }
        }
        return null;
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, CodeEnum parameter, JdbcType jdbcType) throws SQLException {
        ps.setInt(i, parameter.getCode());
    }

    @Override
    public CodeEnum getNullableResult(ResultSet rs, String columnName) throws SQLException {
        return convert(rs.getInt(columnName));
    }

    @Override
    public CodeEnum getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        return convert(rs.getInt(columnIndex));
    }

    @Override
    public CodeEnum getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        return convert(cs.getInt(columnIndex));
    }
}
