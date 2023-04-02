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

## 添加流程图支持

1. 安装pymdown-extensions扩展

```shell
pip install pymdown-extensions
```

2. 添加umlconvert.js至docs/js下，内容如下

```
(function () {
'use strict';

/**
 * Targets special code or div blocks and converts them to UML.
 * @param {object} converter is the object that transforms the text to UML.
 * @param {string} className is the name of the class to target.
 * @param {object} settings is the settings for converter.
 * @return {void}
 */
var uml = (function (converter, className, settings) {

  var getFromCode = function getFromCode(parent) {
    // Handles <pre><code>
    var text = "";
    for (var j = 0; j < parent.childNodes.length; j++) {
      var subEl = parent.childNodes[j];
      if (subEl.tagName.toLowerCase() === "code") {
        for (var k = 0; k < subEl.childNodes.length; k++) {
          var child = subEl.childNodes[k];
          var whitespace = /^\s*$/;
          if (child.nodeName === "#text" && !whitespace.test(child.nodeValue)) {
            text = child.nodeValue;
            break;
          }
        }
      }
    }
    return text;
  };

  var getFromDiv = function getFromDiv(parent) {
    // Handles <div>
    return parent.textContent || parent.innerText;
  };

  // Change article to whatever element your main Markdown content lives.
  var article = document.querySelectorAll("article");
  var blocks = document.querySelectorAll("pre." + className + ",div." + className

  // Is there a settings object?
  );var config = settings === void 0 ? {} : settings;

  // Find the UML source element and get the text
  for (var i = 0; i < blocks.length; i++) {
    var parentEl = blocks[i];
    var el = document.createElement("div");
    el.className = className;
    el.style.visibility = "hidden";
    el.style.position = "absolute";

    var text = parentEl.tagName.toLowerCase() === "pre" ? getFromCode(parentEl) : getFromDiv(parentEl)

    // Insert our new div at the end of our content to get general
    // typset and page sizes as our parent might be `display:none`
    // keeping us from getting the right sizes for our SVG.
    // Our new div will be hidden via "visibility" and take no space
    // via `poistion: absolute`. When we are all done, use the
    // original node as a reference to insert our SVG back
    // into the proper place, and then make our SVG visilbe again.
    // Lastly, clean up the old node.
    ;
    article[0].appendChild(el);
    var diagram = converter.parse(text);
    diagram.drawSVG(el, config);
    el.style.visibility = "visible";
    el.style.position = "static";
    parentEl.parentNode.insertBefore(el, parentEl);
    parentEl.parentNode.removeChild(parentEl);
  }
});

(function () {
  var onReady = function onReady(fn) {
    if (document.addEventListener) {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      document.attachEvent("onreadystatechange", function () {
        if (document.readyState === "interactive") {
          fn();
        }
      });
    }
  };

  onReady(function () {
    if (typeof flowchart !== "undefined") {
      uml(flowchart, "uml-flowchart");
    }

    if (typeof Diagram !== "undefined") {
      uml(Diagram, "uml-sequence-diagram", { theme: "simple" });
    }
  });
})();

}());
```

3. 配置

mkdocs 1.0版本前是

```yaml
markdown_extensions:
  - pymdownx.superfences
custom_fences:
  name: flow
  class: uml-flowchart
  format: !!python/name:pymdownx.superfences.fence_code_format
```

新版本上面的配置会报错Cannot read property 'key' of null，下面的配置适用于新版本(本站版本1.2.2)

```yaml
extra_javascript:
  - 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-MML-AM_CHTML'
  - 'https://cdnjs.cloudflare.com/ajax/libs/raphael/2.2.7/raphael.min.js'
  - 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js'
  - 'https://cdnjs.cloudflare.com/ajax/libs/js-sequence-diagrams/1.0.6/sequence-diagram-min.js'
  - 'https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.6.5/flowchart.min.js'
  - 'js/umlconvert.js'
markdown_extensions:
  - pymdownx.superfences:
      custom_fences:
        - name: flow
          class: uml-flowchart
          format: !!python/name:pymdownx.superfences.fence_div_format
        - name: sequence
          class: uml-sequence-diagram
          format: !!python/name:pymdownx.superfences.fence_div_format
```

效果展示：

markdown源码

```markdown
    ```flow
    st=>start: 开始
    rain?=>condition: 今天有雨吗？
    takeAnUmbrella=>operation: 带伞
    go=>operation: 出门
    e=>end: 结束

    st->rain?
    rain?(yes)->takeAnUmbrella->go
    rain?(no)->go->e
```
```

显示效果

```flow
st=>start: 开始
rain?=>condition: 今天有雨吗？
takeAnUmbrella=>operation: 带伞
go=>operation: 出门
e=>end: 结束

st->rain?
rain?(yes)->takeAnUmbrella->go
rain?(no)->go->e
```

## 发布文档

```shell
mkdocs gh-deploy --force
```

会生成gh-pages分支，在github中设置部署分支即可

![](https://chenpenghuan.github.io/files/20210817_185324_image.png)
