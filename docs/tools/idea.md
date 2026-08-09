# IntelliJ IDEA 插件精简指南（Spring Boot 后端开发）

> 适用：IntelliJ IDEA 2026.1 Ultimate，Spring Boot 3 + Java 17 + MyBatis + Maven 项目
> 维护：2026-08-09

## 背景

IDEA 默认启用 150+ 个内置插件，对纯 Spring Boot 后端开发来说，前端框架、桌面 UI、其他语言/框架、AI 工具等大量插件完全用不到。精简后可显著降低内存占用（省 500MB–1GB）和启动时间。

但**插件之间存在依赖链**，不能只按名字猜用途就禁用。下面三块分类是经过实际验证的（踩过依赖坑后修正）。

---

## 一、Java 后端开发必须要保留的插件

这些是 Spring Boot + MyBatis + Maven 项目的核心支撑，**禁用会直接导致功能不可用或加载失败**。

### 语言与构建
| 插件名 | ID | 作用 |
|---|---|---|
| Java | `com.intellij.java` | Java 语言核心支持（语法、补全、重构、调试） |
| Maven | `org.jetbrains.idea.maven` | Maven 构建工具集成（依赖管理、生命周期、run/debug） |
| Lombok | `Lombook Plugin` | Lombok 注解处理（`@Data`/`@Slf4j` 等），项目大量使用 |
| Properties | `com.intellij.properties` | `.properties` 配置文件支持 |
| YAML | `org.jetbrains.plugins.yaml` | `.yaml`/`.yml` 配置文件支持（Spring 配置、Apollo 配置） |
| JSON | `com.intellij.modules.json` | JSON 文件支持（配置、接口数据） |

### Spring 全家桶
| 插件名 | ID | 作用 |
|---|---|---|
| Spring | `com.intellij.spring` | Spring 框架核心支持（Bean、依赖注入、配置） |
| Spring Boot | `com.intellij.spring.boot` | Spring Boot 专用支持（application.yaml、自动配置提示） |
| Spring Initializr | `com.intellij.spring.boot.initializr` | 通过 Spring Initializr 创建新项目 |
| Spring Cloud | `com.intellij.spring.cloud` | Spring Cloud 支持（网关、注册中心等） |
| Spring Data | `com.intellij.spring.data` | Spring Data repository 支持 |
| Spring Web | `com.intellij.spring.mvc` | Spring MVC/Web 接口支持（Controller、路由） |
| Spring Security | `com.intellij.spring.security` | Spring Security 配置支持 |
| Spring Messaging | `com.intellij.spring.messaging` | Spring Messaging（消息、WebSocket） |
| Spring Integration Patterns | `com.intellij.spring.integration` | Spring Integration 支持 |
| AOP Pointcut Language | `com.intellij.aop` | Spring AOP 切面/切点支持 |

### 持久层与数据库
| 插件名 | ID | 作用 |
|---|---|---|
| Jakarta EE: Persistence (JPA) | `com.intellij.javaee.jpa` | JPA 规范支持——**注意：即使你用 MyBatis，Spring Data 也依赖此插件，不能禁** |
| JVM Persistence Frameworks | `com.intellij.persistence` | 持久层框架底层支撑——JPA 依赖它，连带被 Spring Data 依赖 |
| Database Tools and SQL | `com.intellij.database` | IDE 内 SQL 编辑、表树浏览（可选用 mycli + MCP 替代，见下方"自己斟酌"） |

### 测试
| 插件名 | ID | 作用 |
|---|---|---|
| JUnit | `JUnit` | JUnit 单元测试运行/调试 |
| TestNG | `TestNG-J` | TestNG 测试运行/调试 |
| Code Coverage for Java | `Coverage` | 测试覆盖率统计 |

### 调试与开发工具
| 插件名 | ID | 作用 |
|---|---|---|
| Java Stream Debugger | `org.jetbrains.debugger.streams` | 调试时可视化 Stream API 的中间结果 |
| Java Bytecode Decompiler | `org.jetbrains.java.decompiler` | 反编译第三方 jar 看源码，排查问题必备 |
| DFA Analysis | `com.intellij.dfa.analysis` | 数据流分析（空指针、潜在 NPE 预警） |
| Collections Viewer in Debugger | `com.intellij.debugger.collections.visualizer` | 调试时集合/Map 内容可视化 |

### Web 与 API 工具
| 插件名 | ID | 作用 |
|---|---|---|
| HTTP Client | `com.jetbrains.restClient` | `.http` 接口测试（项目大量使用，测 REST 接口） |
| OpenAPI Specifications | `com.intellij.swagger` | OpenAPI/Swagger 文档支持 |
| Shell Script | `com.jetbrains.sh` | Shell 脚本支持（偶尔写部署/运维脚本） |

### 版本控制
| 插件名 | ID | 作用 |
|---|---|---|
| Git | `Git4Idea` | Git 版本控制集成 |
| Modal Commit Interface | `intellij.git.commit.modal` | 模态 Git 提交对话框 |

### 平台核心
| 插件名 | ID | 作用 |
|---|---|---|
| JetBrains Ultimate | `com.intellij.modules.ultimate` | Ultimate 版基础模块——**禁用会导致众多 Ultimate 功能失效** |
| Terminal | `org.jetbrains.plugins.terminal` | IDE 内终端 |
| MCP Server | `com.intellij.mcpServer` | MCP 协议服务端（Claude Code/IDE 通信） |
| Debugger MCP Toolset | `intellij.debuggerMcp` | 调试器 MCP 工具集 |
| Images | `com.intellij.platform.images` | 图片处理——**HTTP Client 依赖它处理响应** |
| JSONPath | `com.intellij.jsonpath` | JSONPath 查询——**HTTP Client 依赖它解析 JSON 响应** |
| Artifacts Repository Search | `org.jetbrains.idea.reposearch` | 仓库搜索——**Maven 依赖它做依赖搜索** |
| JVM Microservices Frameworks | `com.intellij.microservices.jvm` | 微服务框架支撑——**Spring Initializr 依赖它** |
| Endpoints | `com.intellij.microservices.ui` | 端点管理界面（配套 microservices.jvm） |
| Java Internationalization | `com.intellij.java-i18n` | Java i18n——**Spring Security/Web/Messaging/Integration/Cloud/Dubbo 全依赖**（Spring MessageSource 走 Java i18n 机制） |
| Groovy Live Templates | `org.intellij.groovy.live.templates` | Groovy 代码模板——**Spring Messaging/Cloud/Security/Integration/Dubbo 全依赖**（Spring 配置用 Groovy DSL） |
| Jakarta EE: Web/Servlets | `com.intellij.javaee.web` | Servlet 规范——**Spring Web 依赖**（Spring MVC 建立在 Servlet 上） |
| Jakarta EE Platform | `com.intellij.javaee` | Jakarta EE 平台底层——JAX-RS 等子项依赖 |

---

## 二、自己斟酌的插件

这些插件看个人需求和工作习惯，可留可禁。

### 通用开发工具
| 插件名 | ID | 作用 | 建议 |
|---|---|---|---|
| Markdown | `org.intellij.plugins.markdown` | Markdown 预览/编辑 | 经常在 IDE 看 README/.md 就留 |
| Protocol Buffers | `idea.plugin.protoeditor` | Protobuf/gRPC 文件支持 | 用 gRPC 才留 |
| Toml | `org.toml.lang` | TOML 配置文件支持 | 项目有 `.toml` 才留 |
| XPathView + XSLT | `XPathView` | XPath 查询/XSLT 转换 | 偶尔处理 XML 才留 |
| Refactor-X | `Refactor-X` | XML 重构 | 少用，可禁 |
| Diagrams | `com.intellij.diagram` | 类图/时序图/Mind Map | 看架构图就留 |
| Cron Expressions | `com.intellij.cron` | CRON 表达式辅助 | 有 XXL-Job，写 cron 可留 |
| EditorConfig | `org.editorconfig.editorconfigjetbrains` | `.editorconfig` 代码风格统一 | 项目有配置文件就留 |
| Eclipse Interoperability | `org.jetbrains.idea.eclipse` | Eclipse 项目互导 | 不从 Eclipse 迁移可禁 |
| Java IDE Customization | `com.intellij.java.ide` | Java IDE 定制选项 | 一般用默认即可 |

### 数据库相关
| 插件名 | ID | 作用 | 建议 |
|---|---|---|---|
| Database Tools and SQL | `com.intellij.database` | IDE 内 SQL 编辑、表树浏览 | **重点斟酌**：如果你完全走 mycli + IDEA MCP 全局数据源连库，可禁（省 200–300MB 内存）；如果用 IDE 的 Database 面板查表就留。禁用后不影响 MCP 查库 |

### 主题与体验
| 插件名 | ID | 作用 | 建议 |
|---|---|---|---|
| Chinese Language Pack | `com.intellij.zh` | 中文界面 | 用中文界面就留 |
| Keymap (Eclipse/NetBeans/VS) | `com.intellij.plugins.*keymap` | 其他 IDE 快捷键映射 | 用默认 Mac keymap 就禁这三个 |

### 性能与质量
| 插件名 | ID | 作用 | 建议 |
|---|---|---|---|
| In-Editor Performance Hints | `com.intellij.LineProfiler` | 编辑器内性能提示 | 看个人喜好 |
| Qodana | `org.intellij.qodana` | Qodana 代码质量平台 | 已禁 SonarLint 可不留 |

### 语言包
| 插件名 | ID | 作用 | 建议 |
|---|---|---|---|
| Japanese / Korean Language Pack | `com.intellij.ja` / `com.intellij.ko` | 日/韩文界面 | 中文用户禁 |

---

## 三、完全不需要的插件（已禁用，对 Spring Boot 后端无影响）

这些插件对纯 Spring Boot 后端开发完全用不到，可以放心禁用。下表按类别分组。

### 前端框架与样式（你是后端，完全用不到）
| 插件名 | ID | 作用 |
|---|---|---|
| Angular | `AngularJS` | Angular 前端框架 |
| React | `com.intellij.react` | React 前端框架 |
| Vue.js | `org.jetbrains.plugins.vue` | Vue 前端框架 |
| Next.js | `intellij.nextjs` | Next.js 前端框架 |
| Tailwind CSS | `com.intellij.tailwindcss` | Tailwind CSS 样式框架 |
| Styled Components | `com.deadlock.scsyntax` | Styled Components CSS-in-JS |
| Less | `org.jetbrains.plugins.less` | Less CSS 预处理器 |
| Sass | `org.jetbrains.plugins.sass` | Sass CSS 预处理器 |
| PostCSS | `org.intellij.plugins.postcss` | PostCSS 工具 |
| Prettier | `intellij.prettierJS` | JS/TS 格式化 |
| TSLint | `tslint` | TypeScript lint（已弃用） |
| Stylelint | `com.intellij.stylelint` | CSS lint |
| Webpack | `intellij.webpack` | 前端打包工具 |
| Vite | `intellij.vitejs` | 前端打包工具 |
| Polymer & Web Components | `com.intellij.plugins.webcomponents` | Web Components |
| JavaScript and TypeScript | `JavaScript` | JS/TS 语言支持 |
| JavaScript Debugger | `JavaScriptDebugger` | 前端调试 |
| JavaScript Intention Power Pack | `JSIntentionPowerPack` | JS 意图/快捷操作 |
| CSS | `com.intellij.css` | CSS 语言支持 |
| HTML Tools | `HtmlTools` | HTML 工具 |
| Node.js | `NodeJS` | Node.js 运行时 |
| Karma | `Karma` | JS 测试运行器 |
| Node.js Remote Interpreter | `org.jetbrains.plugins.node-remote-interpreter` | 远程 Node 解释器 |

### 桌面/移动端
| 插件名 | ID | 作用 |
|---|---|---|
| JavaFX | `org.jetbrains.plugins.javaFX` | Java 桌面 GUI |
| Compose Multiplatform | `com.intellij.compose` | Kotlin 桌面 UI |
| Android Gradle DSL | `com.android.tools.gradle.dsl` | 安卓 Gradle |
| Gradle Declarative Support | `com.android.tools.gradle.dcl` | 安卓声明式 DSL |

### 其他语言/框架（你用 Spring Boot + 纯 Java）
| 插件名 | ID | 作用 |
|---|---|---|
| Kotlin | `org.jetbrains.kotlin` | Kotlin 语言（纯 Java 项目不需要） |
| Groovy | `org.intellij.groovy` | Groovy 语言 |
| Gradle | `com.intellij.gradle` | Gradle 构建工具（你用 Maven） |
| Gradle for Java | `org.jetbrains.plugins.gradle` | Java Gradle 集成 |
| Gradle DSL API | `org.jetbrains.idea.gradle.dsl` | Gradle DSL（你用 Maven） |
| Ktor | `intellij.ktor` | Kotlin 服务端框架 |
| Quarkus | `com.intellij.quarkus` | Quarkus 框架（你用 Spring Boot） |
| Micronaut | `com.intellij.micronaut` | Micronaut 框架（你用 Spring Boot） |
| Spring Modulith | `com.intellij.spring.modulith` | Spring Modulith 模块化（你不用此架构） |
| Thymeleaf | `com.intellij.thymeleaf` | Thymeleaf 模板引擎（你不渲染前端模板） |
| FreeMarker | `com.intellij.freemarker` | FreeMarker 模板引擎 |
| Apache Velocity | `apache.velocity` / `com.intellij.velocity` | Velocity 模板引擎 |

### Jakarta EE 子项（Spring Boot 不依赖的剩余部分）
| 插件名 | ID | 作用 |
|---|---|---|
| Jakarta EE: Bean Validation | `com.intellij.beanValidation` / `com.intellij.javaee.beanValidation` | Bean Validation |
| Jakarta EE: CDI | `com.intellij.cdi` / `com.intellij.javaee.cdi` | Contexts and Dependency Injection |
| Jakarta EE: Expression Language (EL) | `com.intellij.javaee.el` / `com.intellij.javaee.el.core` | EL 表达式 |
| Jakarta EE: Messaging (JMS) | `com.intellij.javaee.extensions` | JMS 消息 |
| Jakarta EE: Data | `com.intellij.javaee.jakarta.data` | Jakarta Data 规范 |
| Jakarta EE: RESTful Web Services (JAX-RS) | `com.jetbrains.restWebServices` / `com.intellij.javaee.jaxrs` | JAX-RS |
| Jakarta EE: Server Pages (JSP) | `com.intellij.jsp` / `com.intellij.javaee.jsp` | JSP |
| Jakarta EE: Application Servers | `com.intellij.javaee.app.servers.integration` | 应用服务器集成 |
| WildFly (JBoss) | `JBoss` | JBoss 服务器 |
| Tomcat and TomEE | `Tomcat` | Tomcat 服务器（你用 Undertow，不在 IDE 内管理容器） |
| Tomcat/JBoss App Servers | `javaee-appServers-tomcat` / `javaee-appServers-jboss` | 容器管理 |
| Reverse Engineering | `com.intellij.javaee.reverseEngineering` | 数据库逆向生成实体 |
| JPA | `com.intellij.jpa` / `JPA` | JPA 增强 |
| JPA Model | `com.intellij.jpa.model` / `JPA Model` | JPA 实体模型 |
| Hibernate | `com.intellij.hibernate` / `Hibernate` | Hibernate ORM |
| Flyway | `com.intellij.flyway` / `flyway` | 数据库迁移工具 |
| Liquibase | `com.intellij.liquibase` / `liquibase` | 数据库迁移工具 |

### 部署与容器
| 插件名 | ID | 作用 |
|---|---|---|
| Docker | `Docker` | 容器支持 |
| Dev Containers | `org.jetbrains.plugins.docker.gateway` | Dev Containers |
| Kubernetes | `com.intellij.kubernetes` | K8s 编排支持 |
| FTP/SFTP/WebDAV Connectivity | `com.jetbrains.plugins.webDeployment` | 远程部署 |

### AI / ML 重复工具（已有 Claude Code）
| 插件名 | ID | 作用 |
|---|---|---|
| Full Line Code Completion | `org.jetbrains.completion.full.line` | JetBrains 本地 AI 补全 |
| JetBrains AI Assistant | `com.intellij.ml.llm` / `com.jetbrains.ml.llm` | JetBrains 内置 LLM |
| Junie | `org.jetbrains.junie` | JetBrains AI 编码代理 |
| ML Completion Ranking | `com.intellij.completion.ml.ranking` / `com.intellij.completionMlRanking` | ML 补全排序 |
| ML in Search Everywhere | `com.intellij.searcheverywhere.ml` / `com.intellij.searchEverywhereMl` | ML 搜索 |
| ML in Find Usages | `com.intellij.findusages.ml` / `com.intellij.findUsagesMl` | ML 查找引用 |
| Grazie / Natural Languages | `tanvd.grazi` / `com.intellij.grazie` | 语法/拼写检查（中文开发用不到且吃性能） |
| IDE Features Trainer | `training` / `com.intellij.featuresTrainer` | 新手教程弹窗 |
| SonarLint | `org.sonarlint.idea` | 代码质量检查 |
| Configuration Script | `com.intellij.configurationScript` | IDE 配置脚本 |
| Copyright | `com.intellij.copyright` | 版权声明 |

### 杂项/平台
| 插件名 | ID | 作用 |
|---|---|---|
| Code Provenance by Qodana | `com.intellij.code.provenance` / `com.intellij.code-provenance` | 代码来源追踪 |
| Package Checker | `org.jetbrains.security.package-checker` / `com.intellij.packageChecker` | 漏洞包检查 |
| Bytecode Viewer | `ByteCodeViewer` | 字节码查看器（有 Decompiler 够用） |
| WebP Support | `intellij.webp` / `com.intellij.webp` | WebP 图片格式 |
| TextMate Bundles | `org.jetbrains.plugins.textmate` | TextMate 语法支持 |
| DevKit Runtime | `com.intellij.dev` / `dev` | 插件开发工具 |
| Performance Testing | `com.jetbrains.performancePlugin` / `com.intellij.performance.testing` | 性能测试框架 |
| Async Profiler | `com.jetbrains.performancePlugin.async` / `com.intellij.performance.testing.async` | 异步性能测试 |
| Jupyter | `intellij.jupyter` / `Jupyter` / `com.jetbrains.jupyter` | Jupyter Notebook |
| Kotlin Notebook | `org.jetbrains.plugins.kotlin.jupyter` / `kotlin.jupyter` | Kotlin Notebook |
| Notebook Files | `com.intellij.notebooks.core` | Notebook 文件支持 |
| Station | `com.intellij.station` / `com.jetbrains.station` | JetBrains 协作 |
| Grid | `com.intellij.grid` / `intellij.grid.plugin` | Data Grid 编辑 |
| CWM | `com.intellij.cwm` | Code With Me |
| Gateway | `com.intellij.gateway` / `com.jetbrains.gateway` | 远程开发入口 |
| Remote Development Server | `com.jetbrains.remoteDevServer` | 远程开发服务 |
| Remote Development | `com.jetbrains.remoteDevelopment` | 远程开发 |
| Remote Execution Agent | `intellij.platform.ijent.impl` | 远程执行代理 |
| SSH Remote Run | `org.jetbrains.plugins.remote-run` / `com.intellij.remoteRun` | SSH 远程运行 |
| Shared Indexes | `intellij.indexing.shared.core` | 共享索引 |
| Platform Daemon | `com.intellij.platform.daemon` | 平台守护进程 |
| Tasks / Time Tracking | `com.intellij.tasks` | 任务跟踪 |
| Settings Sync | `com.intellij.settingsSync` | JetBrains 账号设置同步 |
| PlantUML integration | `PlantUML integration` | PlantUML 图（用第三方插件替代） |

---

## 四、自己安装的第三方插件

下面是当前从 Marketplace 安装的第三方插件，单独列出。bundled 与第三方重名时，建议保留 bundled 版、卸载第三方版（减少重复加载）。

### ✅ 推荐保留（对你有用）
| 插件名 | ID | 作用 |
|---|---|---|
| MyBatisX | `com.baomidou.plugin.idea.mybatisx` | MyBatis 增强：Mapper 接口↔XML 跳转、SQL 补全、代码生成 |
| Maven Helper | `MavenRunHelper` | Maven 依赖分析、冲突排查、一键排除 |
| IdeaVim | `IdeaVIM` | Vim 快捷键模拟（VIM 党必备） |
| Grep Console | `GrepConsole` | 控制台日志按规则着色、过滤 |
| Claude Code [Beta] | `com.anthropic.code.plugin` | Claude Code 官方插件（AI 编码助手） |
| CC GUI (Claude or Codex) | `com.github.idea-claude-code-gui` | Claude Code GUI 增强 |
| MCP Server | `com.intellij.mcpServer` | MCP 协议服务端 |
| IDE Index MCP Server | `com.github.hechtcarmel.jetbrainsindexmcpplugin` | IDE 索引通过 MCP 暴露 |
| Apache Dubbo in Spring Framework | `com.intellij.dubbo` | Dubbo 支持（Spring 框架内） |
| Reactive Streams | `com.intellij.reactivestreams` | Reactive Streams 支持 |
| Spring（第三方版） | `com.intellij.spring` | Spring 支持（注意：与 bundled `com.intellij.spring` 重名，建议保留 bundled 版，卸载此第三方版） |
| One Dark Theme | `com.markskelton.one-dark-theme` | One Dark 主题 |

### 🟡 自己斟酌
| 插件名 | ID | 作用 | 建议 |
|---|---|---|---|
| plantuml4idea | `PlantUML integration` | PlantUML 图绘制 | bundled 已禁了同名，看是否需要这个第三方版 |
| SonarQube for IDE | `org.sonarlint.idea` | SonarQube 代码质量 | 已在质量工具里，看是否用 SonarQube 平台 |

### 🔴 可禁用 / 卸载（与 bundled 重复或不需要）
| 插件名 | ID | 作用 | 建议 |
|---|---|---|---|
| Qoder CN (Alibaba Cloud AI) | `com.alibabacloud.intellij.cosy` | 阿里云 AI 编码助手 | 和 Claude Code 重复，可禁 |
| JetBrains AI Assistant（第三方版） | `com.intellij.ml.llm` | JetBrains LLM | 和 Claude Code 重复，可禁 |
| Full Line Code Completion（第三方版） | `org.jetbrains.completion.full.line` | 本地 AI 补全 | 和 Claude Code 重复，可禁 |
| Junie | `org.jetbrains.junie` | JetBrains AI 代理 | 和 Claude Code 重复，可禁 |
| Performance Testing（第三方版） | `com.jetbrains.performancePlugin` | 性能测试 | 和 bundled 重复，卸载第三方版 |
| Jupyter（第三方版） | `intellij.jupyter` | Notebook | 不用 Notebook 可禁 |
| Vite（第三方版） | `intellij.vitejs` | 前端打包 | 前端用不到，卸载 |
| Vue.js（第三方版） | `org.jetbrains.plugins.vue` | 前端框架 | 前端用不到，卸载 |

---

## 五、依赖关系速查（重要）

**禁用插件时务必检查依赖链**。以下是已验证的依赖关系，被依赖的插件**绝不能禁**：

```
HTTP Client ──→ Images                    (处理响应)
HTTP Client ──→ JSONPath                  (解析 JSON 响应)
Maven ──→ Artifacts Repository Search     (仓库搜索)
Spring Initializr ──→ JVM Microservices Frameworks
Spring Security ─┐
Spring Web        ─┤
Spring Messaging  ─┼──→ Java Internationalization   (Spring MessageSource 走 Java i18n)
Spring Integration─┤
Spring Cloud      ─┤
spring-dubbo     ─┘
Spring Messaging ─┐
Spring Cloud     ─┤
Spring Security  ─┼──→ Groovy Live Templates         (Spring 配置用 Groovy DSL)
Spring Integration─┤
spring-dubbo     ─┘
Spring Web ──→ Jakarta EE: Web/Servlets    (Spring MVC 建立在 Servlet 上)
Spring Data ──→ Jakarta EE: Persistence (JPA) ──→ JVM Persistence Frameworks
JAX-RS ──→ Jakarta EE Platform
Ultimate 版众多功能 ──→ JetBrains Ultimate
```

**经验：** 禁用后 IDEA 启动报 `Plugin 'X' cannot be loaded because it depends on plugin 'Y' which failed to load` 时，把 Y 从禁用列表移除即可。

---

## 六、操作方法

### 查看与禁用插件
1. `Settings → Plugins → Installed` 按名称搜索 → 点 Disable
2. 或直接编辑文件：`~/Library/Application Support/JetBrains/IntelliJIdea<版本>/disabled_plugins.txt`，每行一个插件 ID，重启生效

### 查看内置插件清单
`~/Library/Application Support/JetBrains/IntelliJIdea<版本>/bundled_plugins.txt`，格式 `ID|分类`

### 验证
重启 IDEA 后，如果某功能不可用，查看启动日志的 `depends on X which failed to load`，恢复对应插件。

---

## 附：当前状态（2026-08-09）

- IDEA 版本：2026.1.3 Ultimate
- 已禁用插件：144 个
- 仍活跃内置插件：约 34 个（核心栈）
- 第三方插件：22 个（含重复安装）

