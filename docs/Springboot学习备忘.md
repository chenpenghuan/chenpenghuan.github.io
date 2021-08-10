# Springboot学习备忘

## 终端运行

1. 打包时跳过单元测试 
  `mvn install -Dmaven.test.skip=true` 
  `cd target` 
  `java -jar xxxx.jar` 

2. mvn直接运行
  `mvn spring-boot:run`

3. 打包运行

  - 打包

  ```
   mvn -U clean package -Dmaven.test.skip=true
  ```

  1. 运行

  ```
  java -jar xxx.jar --spring.profiles.active=dev
  ```

  

## 优化依赖

```
//查询依赖
mvn dependency:analyze
```

## 多数据库配置

- 使用dynamic-datasource-spring-boot-starter
- 参考`https://gitee.com/baomidou/dynamic-datasource-spring-boot-starter`

*注意：driver-class-name必须为com.mysql.jdbc.Driver*

## 缓存失效时间
```java
@Cacheable(value = "people#${select.cache.timeout:1800}#${select.cache.refresh:600}", key = "#person.id", sync = true)
```
## jackson配置

```
  jackson:
    date-format: yyyy-MM-dd HH:mm:ss
    time-zone: GMT+8
    serialization:
      #格式化输出
      indent_output: true
      #忽略无法转换的对象
      fail_on_empty_beans: false
      #忽略null
    default-property-inclusion: non_null
    deserialization:
      fail_on_unknown_properties: false
    parser:
      allow_unquoted_control_chars: true
      allow_single_quotes: true
```





## 多语言适配

使用springboot内置的i18n，项目配置文件中添加

```java
  messages:
    basename: i18n.common,i18n.bonus
    cache-duration: 1
```
## 中间件配置
定义注解

```java
package com.coinness.common.requestLimit;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequestLimit {
    /**
     * 允许访问的次数，默认值MAX_VALUE
     */
    int count() default 120;

    /**
     * 时间段，单位为毫秒，默认值一分钟
     */
    long time() default 60000;

    /**
     * 是否生效
     */

    boolean limit() default true;
}
```
实现注解

```java
package com.coinness.common.requestLimit;


import com.coinness.common.http.CodeMsgEnum;
import com.coinness.common.http.CommonResponse;
import com.coinness.common.json.DefaultSerializer;
import com.coinness.utils.Base64Utils;
import com.coinness.utils.IPUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.concurrent.TimeUnit;


@Component
public class RequestLimitInterceptor implements HandlerInterceptor {
    @Autowired
    private RedisTemplate redisTemplate;
    private static final Logger logger = LoggerFactory.getLogger(RequestLimitInterceptor.class);

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        try {
            HandlerMethod method = (HandlerMethod) handler;
            RequestLimit classRequestLimit = method.getBeanType().getAnnotation(RequestLimit.class);
            RequestLimit methodRequestLimit = method.getMethodAnnotation(RequestLimit.class);
            RequestLimit requestLimit = methodRequestLimit != null ? methodRequestLimit : classRequestLimit;
            String ip = IPUtils.getIpAddress(request);
            String url = request.getRequestURL().toString();
            String queryStr = request.getQueryString() == null ? "" : request.getQueryString();
            String uuid = request.getHeader("uuid") == null ? "" : request.getHeader("uuid");

            String key = "req_limit_".concat(Base64Utils.encode("_url_".concat(url).concat("_ip_").concat(ip).concat("_queryStr_").concat(queryStr).concat("_uuid_").concat(uuid)));
            logger.info("查询redis", redisTemplate.opsForValue().get(key));
            if (requestLimit != null && requestLimit.limit() == true) {
                if (redisTemplate.opsForValue().get(key) == null || redisTemplate.opsForValue().get(key).equals(0)) {
                    redisTemplate.opsForValue().set(key, 1, requestLimit.time(), TimeUnit.MILLISECONDS);
                } else {
                    redisTemplate.opsForValue().increment(key, 1);
                }
                int count = (int) redisTemplate.opsForValue().get(key);
                if (count > requestLimit.count()) {
                    return doFailResponse(CommonResponse.error(CodeMsgEnum.too_many_attempts), response);
                }
            }
        } catch (Exception e) {
            logger.error("requestLimit exception...", e);
        }
        return true;
    }

    public boolean doFailResponse(CommonResponse result, HttpServletResponse response) throws IOException {
        response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
        PrintWriter writer = response.getWriter();
        writer.print(DefaultSerializer.write(result));
        writer.close();
        response.flushBuffer();
        return false;
    }

}
```

配置中间件

```java
@Configuration
public class MvcInterceptorConfig extends WebMvcConfigurationSupport {
    @Autowired
    private RequestLimitInterceptor requestLimitInterceptor;

    @Override
    protected void addInterceptors(InterceptorRegistry registry) {
        // addPathPatterns 用于添加拦截规则，/**表示拦截所有请求
        // excludePathPatterns 用户排除拦截
        registry.addInterceptor(requestLimitInterceptor)
                .addPathPatterns("/**");
//                .excludePathPatterns("/activities/", "/api/**");
        super.addInterceptors(registry);
    }
}
```

## RedisUtils使用

1. Pom.xml添加依赖

```xml
        <dependency>
            <groupId>com.dyuproject.protostuff</groupId>
            <artifactId>protostuff-runtime</artifactId>
            <version>1.1.3</version>
        </dependency>
        <dependency>
            <groupId>com.dyuproject.protostuff</groupId>
            <artifactId>protostuff-core</artifactId>
            <version>1.1.3</version>
        </dependency>
```



2. 拉取`https://github.com/whvcse/RedisUtil`代码，写入自己的项目
3. 添加`@Component`注解，然后在项目中@Autowired注入

## thymeleaf报@Autowired错误解决

```
org.springframework.beans.factory.UnsatisfiedDependencyException: Error creating bean with name 'com.coinness.risk.MessageTests': Unsatisfied dependency expressed through field 'templateEngine'; nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException: No qualifying bean of type 'org.thymeleaf.TemplateEngine' available: expected at least 1 bean which qualifies as autowire candidate. Dependency annotations: {@org.springframework.beans.factory.annotation.Autowired(required=true)}
```

原因：thymeleaf与spring-boot-starter-thymeleaf版本不一致，检查maven，修改版本号即可

## 命令行运行代码

```java
public class RiskServiceApplication implements CommandLineRunner {
    @Autowired
    private UserService userService;
    public static void main(String[] args) throws ParseException {
        //不启动webservice
        new SpringApplicationBuilder(RiskServiceApplication.class).web(WebApplicationType.NONE).run(args);
    }

    @Override
    public void run(String[] args) {
        System.out.println(userService.getUserInfo("1111226"));
    }
}
```

