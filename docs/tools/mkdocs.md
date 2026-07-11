# mkdocs

## 环境配置

1. 安装virtualenv `pip install virtualenv`，在当前项目目录下创建python虚拟环境 `virtualenv -p /usr/bin/python3 venv`
2. 激活venv `source venv/bin/activate`
3. 安装依赖`pip install ``-``r requirements.txt`
4. 使用venv `source venv/bin/activate`
5. 退出even `deactivate`

>

## 文档目录配置

```yaml
site_name: 文档
pages:
    - 主页: index.md
    - 工作: [md1.md,md2.md]
    - 关于: about.md
```

## 自带主题修改

修改mkdocs自带的主题

1. 复制mkdocs的主题文件夹至自定义主题文件夹custom_theme下
2. 修改项目配置文件mkdocs.yml

```shell
theme:
  name: 'mkdocs'
  custom_dir: 'custom_theme'
```

3. 修改custom_theme/main.html，比如要修改底部的“Documentation built with MkDocs”

```shell
{%- block footer %}
    <hr>
    {%- if config.copyright %}
        <p>{{ config.copyright }}</p>
    {%- endif %}
    <!--<p>Documentation built with <a href="https://www.mkdocs.org/">MkDocs</a>.</p>-->
{%- endblock %}
```

## Mermaid 图表支持

当前使用 [Mermaid](https://mermaid.js.org/) 渲染图表，支持流程图、时序图、思维导图等。

### 流程图

````markdown
```mermaid
graph TD
    A[开始] --> B{今天有雨吗？}
    B -->|是| C[带伞]
    B -->|否| D[出门]
    C --> D
    D --> E[结束]
```
````

效果：

```mermaid
graph TD
    A[开始] --> B{今天有雨吗？}
    B -->|是| C[带伞]
    B -->|否| D[出门]
    C --> D
    D --> E[结束]
```

### 时序图

````markdown
```mermaid
sequenceDiagram
    participant 用户
    participant 服务器
    用户->>服务器: 发送请求
    服务器-->>用户: 返回响应
```
````

### 思维导图

````markdown
```mermaid
mindmap
  root((项目))
    前端
      React
      Vue
    后端
      Java
      Python
    运维
      Docker
      K8s
```
````

效果：

```mermaid
mindmap
  root((项目))
    前端
      React
      Vue
    后端
      Java
      Python
    运维
      Docker
      K8s
```

## 发布文档

```shell
mkdocs gh-deploy --force
```

会生成gh-pages分支，在github中设置部署分支即可

![](https://chenpenghuan.github.io/files/20210817_185324_image.png)

## github图床

1. 登录github创建repo
2. 填写仓库资料，确保repo权限为public
3. 创建上传token，Settings -> Developer settings -> Personal access tokens，勾选repo
4. 安装picgo，配置图床

![图床配置](http://chenpenghuan.github.io/files/20230416153510.png)
