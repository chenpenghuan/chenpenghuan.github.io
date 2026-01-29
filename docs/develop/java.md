# java

## jdk安装

下载链接 `https://www.injdk.cn/`

## idea中lombok报错

lombok报错

```
java: 不兼容的类型: 无法推断java.util.ArrayList<>的类型参数
    原因: 不存在类型变量E的实例, 以使java.util.ArrayList<E>与lombok.val一致
```

解决办法：

![lombok编译错误解决](https://chenpenghuan.github.io/files//img/20220802165524.png)

```java
-Djps.track.ap.dependencies=false
```

## java: java.lang.ClassNotFoundException: 
org.springframework.boot.configurationprocessor.ConfigurationMetadataAnnotationProcessor

有时候 IDEA 会在配置里偷偷记下一个“Hardcoded（硬编码）“的路径。
打开 Settings -> Build, Execution, Deployment -> Compiler -> Annotation Processors。
观察右侧面板，看 “Annotation Processor Path” 区域。如果下方列表里有任何条目，全部选中并点右侧的减号 - 删除。
确保选中了 “Obtain processors from project classpath”。
点击 OK 后，执行 Build -> Rebuild Project。3. 检查全局 Maven JDK 设置
即便项目里是 17，如果 IDEA 内部运行 Maven 用的环境不对，也会导致解析异常。
进入 Settings -> Build, Execution, Deployment -> Build Tools -> Maven -> Importing。
检查 JDK for importer，不要选 “Internal” 或 “Project SDK”，手动指定为你安装的 JDK 17 路径。
同样，在 Maven -> Runner 里的 JRE 也手动指定为 17。4. 终极一试：在命令行编译
这是为了排除 IDEA 本身干扰。
1. 在 IDEA 下方打开 Terminal（终端）。
2. 输入命令：mvn clean compile
3. 观察结果：
如果命令行也报错： 说明你的 pom.xml 依赖真的有问题（比如父工程版本冲突）。
如果命令行成功了： 说明纯粹是 IDEA 的编译器（JPS）抽风。
