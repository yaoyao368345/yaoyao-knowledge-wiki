# yaoyao knowledge wiki

基于 Quartz 5.0.0 的个人知识库，目前整理机器学习课程和英语学习笔记，支持全文搜索、文章大纲、双向链接、知识图谱、深浅色模式与专注阅读。

[在线阅读](https://yaoyao368345.github.io/yaoyao-knowledge-wiki/)

## 编辑与预览

在 Obsidian 中打开 **`content/`** 作为笔记库，或直接用编辑器修改该目录。添加分类文件夹和 Markdown 笔记后，网站会自动收录。

使用 Node.js 24.20.0（版本记录在 `.nvmrc` 和 `.node-version`）。首次安装需要 Git 和 GitHub 网络：

```powershell
npm ci
npm run plugins:install
npm run dev
```

打开 http://127.0.0.1:8767/ 。保存笔记后自动重建，Ctrl+C 停止。也可以运行 `./start-review.ps1` 启动预览。

```powershell
npm run build
npm run check:knowledge
```

检查命令另需 Python 3，包含标题、大纲、导航回归检查，以及全站链接、资源和锚点检查。构建产物在 `public/`，不要直接编辑。

## 日常维护

- 笔记和图片：`content/`，支持普通 Markdown、Wiki 链接和图片嵌入。
- 分类名称：各分类 `index.md` 的标题；分类页只保留标题和必要元数据，由 Quartz 自动生成带日期的文章列表。
- 学习顺序：`navigation.json`，列出的文件优先排列，其他文件自动追加；修改后重启预览。保持文件路径稳定，标题可直接编辑。
- 站点、插件和配色：`quartz.config.yaml`；布局和目录排序：`quartz.ts`。
- 阅读模式：普通布局显示分栏图标，专注阅读显示高亮书本；本地状态提示位于 `extensions/reader-mode-feedback.inline.ts`。
- 页面切换和手机适配：`quartz/components/scripts/spa.inline.ts`、`quartz/styles/custom.scss`。系统启用减少动态效果时跳过切换动画。
- 仓库子路径适配：`extensions/project-paths.mjs` 在生成浏览器资源时修正当前锁定插件的索引、目录、搜索和图谱路径，不修改插件缓存。插件升级导致调用形状变化时会停止构建，需复核适配。
- 标题与大纲适配：`extensions/knowledge-content.mjs`，只在渲染时去重首个 H1，不修改笔记原文；可用 YAML `title` 指定标题、`enableToc: false` 隐藏大纲。

## 发布网站

GitHub Actions 工作流位于 `.github/workflows/deploy.yml`。推送到 `main` 后自动安装锁定依赖和 Quartz 插件、构建、检查链接，再发布到 GitHub Pages。也可在 Actions 页面手动运行。首次运行会安装全部插件；后续按锁文件和 Node 版本复用插件缓存。

修改笔记后：

```powershell
git add content
git commit -m "docs: update learning notes"
git push
```

Actions 自动从 Pages 配置取得域名和仓库子路径，本地配置仍使用 `localhost:8767`，无需在预览与发布之间手动切换。

`package-lock.json` 和 `quartz.lock.json` 固定依赖版本。`node_modules/`、插件缓存、构建产物、Obsidian 本地设置及 `reports/` 中的备份和诊断记录均不提交。旧 MkDocs 和已移除的 Markdown 学习内容保留在本地备份中。

Quartz 使用 MIT 许可证，见 [LICENSE.txt](LICENSE.txt)。
