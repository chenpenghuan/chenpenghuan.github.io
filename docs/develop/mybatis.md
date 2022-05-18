# mybatis配置

## 按主键操作数据方法生成

```xml
        <table tableName="app_functions"
               domainObjectName="AppFunctions"
               enableCountByExample="true"
               enableUpdateByExample="true"
               enableDeleteByExample="true"
               enableSelectByExample="true"
               selectByExampleQueryId="true"
               delimitAllColumns="true"
               enableSelectByPrimaryKey="true"
               enableInsert="true"
               enableDeleteByPrimaryKey="true"
               enableUpdateByPrimaryKey="true"
        >
            <generatedKey column="id" sqlStatement="mysql" identity="true"/>
            <columnOverride column="app_function" property="appFunction" javaType="java.lang.Integer"/>
            <columnOverride column="app_type" property="appType" javaType="java.lang.Integer"/>
        </table>
```

## 使用驼峰命名

xml配置

```xml
        <!-- targetPackage：生成的实体类所在的包 -->
        <!-- targetProject：生成的实体类所在的硬盘位置 -->
        <javaModelGenerator targetPackage="com.coinness.core.dao.db.pojo"
                            targetProject="./src/main/java">
            <!-- 是否允许子包 -->
            <property name="enableSubPackages" value="false"/>
            <!-- 是否对modal添加构造函数 -->
            <property name="constructorBased" value="true"/>
            <!-- 是否清理从数据库中查询出的字符串左右两边的空白字符 -->
            <property name="trimStrings" value="true"/>
            <!-- 建立modal对象是否不可改变 即生成的modal对象不会有setter方法，只有构造方法 -->
            <property name="immutable" value="false"/>
            <!-- 不使用字段名 -->
            <property name="useActualColumnNames" value="false" />
        </javaModelGenerator>
```

yml中配置

```yaml
mybatis:
  mapper-locations: classpath:/mapper/*.xml  #注意：一定要对应mapper映射xml文件的所在路径
  type-aliases-package: com.coinness.core.dao.db.mapper  # 注意：对应实体类的路径
  configuration:
    map-underscore-to-camel-case: true # 查询语句自动转驼峰，解决定义@Select查出数据字段为null的问题
```

## mybatis-plus@Select查询list，all elements are null的问题

需要在mapper接口中指定resultMap，代码如下

```java
package com.xxx.xxx.provider.dao.mapper;
 */
public interface XXXMappper extends BaseMapper<XXX> {

    @Select("select * from xxx WHERE f_deleted=1")
    @ResultMap("BaseResultMap")
    List<LiveGroup> getGroupDeleted();
}
```



```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.xxx.xxx.provider.dao.mapper.XXXMapper">

    <!-- 通用查询映射结果 -->
    <resultMap id="BaseResultMap" type="com.xxx.xxx.provider.dao.entity.XXX">
        <id column="f_id" property="id" />
        <result column="f_deleted" property="deleted" />
        <result column="f_recommend" property="recommend" />
    </resultMap>

    <!-- 通用查询结果列 -->
    <sql id="Base_Column_List">
        f_id, f_deleted, f_recommend
    </sql>

</mapper>
```

