# mkdocs注意事项

## 文档目录配置

```
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

```
theme:
  name: 'mkdocs'
  custom_dir: 'custom_theme'
```

3. 修改custom_theme/main.html，比如要修改底部的“Documentation built with MkDocs”

```
{%- block footer %}
	<hr>
	{%- if config.copyright %}
		<p>{{ config.copyright }}</p>
	{%- endif %}
    <!--<p>Documentation built with <a href="https://www.mkdocs.org/">MkDocs</a>.</p>-->
{%- endblock %}
```



