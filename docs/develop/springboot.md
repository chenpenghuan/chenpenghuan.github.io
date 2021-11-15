# springboot

## 终端运行

1. 打包时跳过单元测试 
   
   ```shell
   mvn install -Dmaven.test.skip=true 
   cd target
    java -jar xxxx.jar
   ```

2. mvn直接运行
   
   ```shell
   mvn spring-boot:run
   ```

3. 打包运行
   
   - 打包
   
   ```shell
   mvn -U clean package -Dmaven.test.skip=true
   ```
   
   1. 运行
   
   ```shell
   java -jar xxx.jar --spring.profiles.active=dev
   ```

## 优化依赖

```shell
#查询依赖
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

```yaml
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

```yaml
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

```java
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

## springboot集成springdata-es

1. 集成spring-boot-starter-data-elasticsearch
   
   ```xml
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-data-elasticsearch</artifactId>
   </dependency>
   ```

2. yml添加配置
   
   ```yaml
     elasticsearch:
       rest:
         uris: http://search.es.hk-prod-1.adm.mmjj.info:9200
         password: GMDZk8T910fS2v70ethI90d7
         username: elastic
   ```

3. 指定es的package，在启动类上添加
   
   ```java
   @EnableElasticsearchRepositories(basePackages = "com.co.core.es")
   public class CoreApplication {
       public static void main(String[] args) {
           System.setProperty("es.set.netty.runtime.available.processors", "false");
           SpringApplication.run(CoreApplication.class, args);
       }
   }
   ```

4. 编写pojo
   
   ```java
   package com.co.core.es;
   
   import com.fasterxml.jackson.annotation.JsonProperty;
   import lombok.Data;
   import org.springframework.data.annotation.Id;
   import org.springframework.data.elasticsearch.annotations.Document;
   import org.springframework.data.elasticsearch.annotations.Field;
   import org.springframework.data.elasticsearch.annotations.FieldType;
   
   /**
    * @author cph
    */
   @Data
   @Document(indexName = "comprehensive-search_article", type = "article",createIndex = false)
   //@ToString
   //@AllArgsConstructor
   //@NoArgsConstructor
   //@Builder
   public class ComprehensiveSearch {
       @Id
       private String id;
   
       @Field(name = ARTICLE_TYPE, type = FieldType.Byte)
       @JsonProperty(ARTICLE_TYPE)
       private Integer articleType;
   
       @JsonProperty(SOURCE)
       @Field(name = SOURCE, type = FieldType.Text)
       private String source;
   
       @Field(name = LANGUAGE_ID, type = FieldType.Byte)
       @JsonProperty(LANGUAGE_ID)
       private Integer languageId;
   
       @Field(type = FieldType.Text, searchAnalyzer = "ik_smart", analyzer = "ik_max_word")
       @JsonProperty(TITLE)
       private String title;
   
       @Field(type = FieldType.Text, searchAnalyzer = "ik_smart", analyzer = "content_analyzer")
       @JsonProperty(CONTENT)
       private String content;
   
       @Field(name = ARTICLE_ID, type = FieldType.Long)
       @JsonProperty(ARTICLE_ID)
       private Long articleId;
   
       @Field(name = UPDATE_TIME, type = FieldType.Date)
       @JsonProperty(UPDATE_TIME)
       private Long updateTime;
   
       @Field(name = ISSUE_TIME, type = FieldType.Date)
       @JsonProperty(ISSUE_TIME)
       private Long issueTime;
   
       @Field(value = VISIT_NUM,type = FieldType.Long)
       @JsonProperty(VISIT_NUM)
       private Long visitNum;
   
       @Field(value = IS_SOURCE_HIDE,type = FieldType.Byte)
       @JsonProperty(IS_SOURCE_HIDE)
       private Integer isSourceHide;
   
   //    @Field(value = CONTENT_JSON,type = FieldType.Text)
       private String contentJson;
   ```

```java
   public static final String ARTICLE_ID = "article_id";
   public static final String ARTICLE_TYPE = "article_type";
   public static final String COMMENT_NUM = "comment_num";
   public static final String SOURCE = "source";
   public static final String LANGUAGE_ID = "language_id";
   public static final String TITLE = "title";
   public static final String CONTENT = "content";
   public static final String UPDATE_TIME = "update_time";
   public static final String ISSUE_TIME = "issue_time";
   public static final String VISIT_NUM = "visit_num";
   public static final String IS_SOURCE_HIDE = "is_source_hide";
   public static final String CONTENT_JSON = "content_json";
```

   }

```java
4. 编写Repository

```java
package com.co.core.es;

import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

public interface ComprehensiveSearchRepository extends ElasticsearchRepository<ComprehensiveSearch,String> {
}
```

5. 查询es
   
   ```java
       @Resource
       private ComprehensiveSearchRepository repository;
   
       /**
        * @param pageNum
        * @param pageSize
        * @param keyword
        * @param onlyArticleId 是否只输出id字段
        * @param languageId
        * @param articleType   2快讯，3深度
        * @return
        */
       @Override
       public Page<ComprehensiveSearch> searchArticle(int pageNum, int pageSize, String keyword, boolean onlyArticleId, int languageId, int articleType) {
           MultiMatchQueryBuilder multiMatchQueryBuilder = QueryBuilders.multiMatchQuery(keyword).field(ComprehensiveSearch.TITLE, 2F).analyzer("ik_max_word").field(ComprehensiveSearch.CONTENT, 1F).analyzer("ik_max_word");
           if (NumberUtils.isParsable(keyword) && NumberUtils.isDigits(keyword)) {
               multiMatchQueryBuilder.field(ComprehensiveSearch.ARTICLE_ID, 10F);
           }
           multiMatchQueryBuilder.type(MultiMatchQueryBuilder.Type.PHRASE).minimumShouldMatch("100%").maxExpansions(1).slop(0);
           BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery()
                   .must(QueryBuilders.termQuery(ComprehensiveSearch.LANGUAGE_ID, languageId))
                   .must(QueryBuilders.termQuery(ComprehensiveSearch.IS_SOURCE_HIDE, 0))
                   .must(QueryBuilders.termQuery(ComprehensiveSearch.ARTICLE_TYPE, articleType))
                   .must(multiMatchQueryBuilder);
           List<Sort.Order> orders = new ArrayList<>();
           orders.add(new Sort.Order(Sort.Direction.DESC, ComprehensiveSearch.ARTICLE_ID));
           Pageable pageable = PageRequest.of(pageNum - 1, pageSize, Sort.by(orders));
   
           NativeSearchQuery searchQuery = new NativeSearchQueryBuilder()
                   .withQuery(boolQueryBuilder)
                   .withPageable(pageable)
                   .build();
           org.springframework.data.domain.Page<ComprehensiveSearch> page = repository.search(searchQuery);
           return page;
       }
   ```

## 引用本地jar包

1. 加载依赖

```xml
        <dependency>
            <groupId>com.co</groupId>
            <artifactId>common</artifactId>
            <version>0.0.2-SNAPSHOT</version>
            <scope>system</scope>
            <systemPath>${pom.basedir}/lib/common-0.0.2-SNAPSHOT.jar</systemPath>
        </dependency>
```

2. 配置打包

```xml
    <build>
        <finalName>news</finalName>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <includeSystemScope>true</includeSystemScope>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
```

