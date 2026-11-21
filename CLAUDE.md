# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目性质

这是一个用 MkDocs + Material 主题构建的中文个人笔记静态站点（https://chenpenghuan.github.io），没有应用代码、测试或 lint；所有内容都是 `docs/` 下的 Markdown。构建配置在 `mkdocs.yml`，依赖固定在 `requirements.txt`（Python 3.9）。

## 常用命令

仓库内已有 `venv/` 虚拟环境（未纳入版本控制）：

```bash
source venv/bin/activate          # 激活虚拟环境
pip install -r requirements.txt   # 重新安装/更新依赖

mkdocs serve                      # 本地预览，默认 http://127.0.0.1:8000
mkdocs build                      # 输出到 site/（已 gitignore）
mkdocs build --strict             # 检查导航/链接引用问题
mkdocs gh-deploy --force          # 构建并强制推送到 gh-pages 分支（线上发布方式）
```

站点通过 GitHub Pages 从 `gh-pages` 分支发布，提交记录形如 `Deployed <commit> with MkDocs version: 1.6.1`。没有 CI workflow，发布必须手动执行 `mkdocs gh-deploy --force`；只提交到 `master` 不会更新线上站点。

## 内容结构约定

- 新页面放在 `docs/tools/`（工具类）或 `docs/other/`（其他），文件名可为中文。
- **新增页面必须在 `mkdocs.yml` 的 `nav:` 中显式添加**，否则页面虽然会被构建，但不会出现在导航里。注意目前 nav 只列出了部分页面（如 `tools/ai.md`、`tools/git.md`、`tools/idea.md`、`tools/QQ ScreenCapture Plugin 独立运行配置.md` 均未列入），新增或整理页面时留意这一点。
- 标签：在页面顶部 YAML frontmatter 写 `tags:` 列表（如 `tags: [macOS, 工具]`）；标签索引页是 `docs/tags.md`，内容仅 `<!-- material/tags -->`，由 `tags` 插件生成。
- 图片有两种引用方式：历史页面多用外部图床 `https://chenpenghuan.github.io/files/...`；较新的页面将图片放在 `docs/assets/images/` 并通过站点绝对路径 `/assets/images/xxx.png` 引用。新增图片优先用后者。

## 关键构建机制

- **Mermaid**：`mkdocs.yml` 通过 `pymdownx.superfences` 的 `custom_fences` 把 `mermaid` 代码块渲染为 `<div class="mermaid">`（本身不加载 JS）。实际渲染由主题覆盖文件 `themes/material/main.html` 完成：它 `extends "base.html"`，从 jsDelivr 加载 mermaid@11，并在 `document$.subscribe(...)` 中重新运行，以兼容 Material 的即时导航（切换页面不刷新）。改动 Mermaid 行为要改这个文件，而不是 `mkdocs.yml`。
- `themes/material/` 是 `theme.custom_dir` 指向的覆盖目录，目前只覆盖 `main.html`；Material 主题本身的其它模板仍来自 pip 安装的 `mkdocs-material`。
- `git-revision-date-localized` 插件（启用创建日期）从 git 历史读取日期，因此构建环境必须保留 `.git`；在无历史的导出副本中构建会失败或丢失日期。
- 搜索插件启用了 `zh` + `en`（中文分词依赖 `jieba`）。
- `site/`、`.site/`、`.DS_Store` 已在 `.gitignore` 中；不要提交构建产物。`venv/` 也未纳入版本控制，避免误提交。

## 修改后的验证

内容改动用 `mkdocs serve` 本地预览；结构性改动（nav、插件、主题模板）至少跑一次 `mkdocs build --strict` 确认无告警。
