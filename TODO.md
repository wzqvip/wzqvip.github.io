# TODO —— 项目状态看板

> 本文件是项目的「状态仪表盘」，记录**进行中的进度**（迁移、待办、迭代计划）。
> 稳定的事实与操作说明请查 [`README.md`](./README.md)。
>
> 状态标签：`[ ]` 未完成 ｜ `[x]` 已完成
>
> **最后更新：2026-09-26**

---

## 🚧 当前阻塞项

| # | 事项 | 不做会怎样 | 操作指引 |
| --- | --- | --- | --- |
| 1 | **安装 Giscus App 到仓库** | 文章页底部的评论区显示配置错误（文章本身正常） | [README 第二节 步骤 3](./README.md#步骤-3待完成安装-giscus-app) |

> 其余初始化事项（开启 Discussions、取得 `category-id`、切换 Pages 来源、工作流权限）
> 已于 2026-09-26 全部完成并线上验收通过，操作留档见 README 第二节的折叠区。
>
> ⚠️ 第 1 项无法用命令行代做：安装 GitHub App 必须在浏览器里完成一次授权。

---

## 一、[基础搭建]

### 已完成

- [x] Hexo 8.1.2 项目骨架初始化（`package.json` / `_config.yml` / `scaffolds/` / `.gitignore`）
- [x] 主题 Fluid 1.9.9 以 **npm 依赖**方式接入（不需要 git submodule，`themes/` 目录故意留空）
- [x] 开启 `post_asset_folder` 文章同名资产文件夹
- [x] 配置 `marked.prependRoot` + `marked.postAsset`，**实测确认**正文图片相对路径规则
      （结论：只写文件名 `![x](cover.png)`；写成 `![x](文章名/cover.png)` 会 404）
- [x] 设置 `timezone: 'Asia/Shanghai'`，避免 Actions 以 UTC 构建导致时间偏移 8 小时
- [x] 设置 `updated_option: 'empty'`，避免每篇文章的「最后更新」都变成构建当天
- [x] 示例文章 `source/_posts/hello-world.md`（含同名图片文件夹与封面图）
- [x] 「关于」页 `source/about/index.md`（导航栏 `/about/` 不再是死链）
- [x] Giscus 评论接入，已预填 `repo` 与 `repo-id`
- [x] 本地前端搜索可用（Fluid 主题**内置**生成 `/local-search.xml`，无需 `hexo-generator-search` 等插件）
- [x] GitHub Actions 部署流水线 `.github/workflows/deploy.yml`
      （含 `permissions: contents: write`、并发控制、构建产物校验）
- [x] `.gitignore` 忽略 `public/`、`node_modules/`、`db.json`
- [x] 本地 `hexo clean && hexo generate` 构建验证通过（35 个产物，无报错）
- [x] 从 GitHub API 取得 `repo-id` = `R_kgDOPBveyQ`
- [x] 核实 HTTPS 已强制开启（Pages 设置 `https_enforced: true`），无需额外操作
- [x] 开启仓库 Discussions（GitHub 已自动建好 6 个默认分类）
- [x] 经 GraphQL 取得 `category-id` = `DIC_kwDOPBveyc4DGe0K` 并写入 `_config.fluid.yml`
- [x] 用 `npm ci` 复现 CI 安装流程并验证通过
      （过程中发现 lockfile 与 `package.json` 不同步会导致 `npm ci` 直接失败，已修复，
      否则**首次部署就会挂**）
- [x] 提交并推送到 `main` 分支
- [x] Actions 首次构建成功（`Deploy Hexo Blog`，约 20 秒），`gh-pages` 分支自动生成
- [x] 验证仓库 read-only 默认权限下，workflow 内的 `permissions: contents: write`
      足以推送 `gh-pages`（**不需要**改仓库设置，文档已更正）
- [x] Pages 发布来源切换为 `gh-pages` 分支（切换后不会自动重建，已手动触发一次 Pages 构建）
- [x] 线上验收通过：首页 / 文章页 / 封面图 / 关于页 / 归档页 / 搜索索引 全部返回 200
- [x] 核对线上 HTML：Giscus 参数（含 `category-id`）与图片相对路径均正确

### 待办

- [ ] **安装 Giscus App 到仓库**（唯一剩余步骤，只能在浏览器手动做一次）
- [ ] 站点信息转正式：`_config.yml` 的 `title` / `author` / `description` / `keywords`
      （当前为占位值：`wzqvip 的博客` / `wzqvip`）
- [ ] 「关于」页信息转正式：`_config.fluid.yml` 的 `about` 段昵称、简介、社交图标
- [ ] 把头像换成自己的图片（放到 `source/img/` 后改 `about.avatar`）
- [ ] 把 `favicon` 换成自己的图标
- [ ] 正式文章就位后，删除示例文章 `hello-world`（现在可先当作写法范例留着）

---

## 二、[数据迁移追踪]

> 背景：历史内容经历了 **Typecho → WordPress → Hexo** 两次搬迁，
> 本次任务是把它落到当前的 Hexo 结构中并修复资源引用。
>
> ⚠️ **迁移前请先确认上面的「阻塞项」已全部完成**，并确认线上示例文章能正常显示，
> 否则迁移出问题时会分不清是新旧哪一环导致的。

### 阶段 1：导出

- [ ] 登录 WordPress 后台 → 工具 → 导出 → 选择「所有内容」→ 下载导出 XML 文件
- [ ] 同时备份 `wp-content/uploads/` 整个目录（图片原文件，作为抓取失败的兜底）
- [ ] 把 XML 文件保存到项目外的临时目录（不要提交进仓库）

### 阶段 2：转换为 Markdown

- [ ] 安装转换插件：`npm install hexo-migrator-wordpress --save`
- [ ] 执行转换：`npx hexo migrate wordpress <导出文件.xml>`
- [ ] 检查 `source/_posts/` 下生成的文章，确认 front-matter 的 `title` / `date` / `tags` / `categories`
- [ ] 处理转换残留：WordPress 短代码（`[caption]`、`[gallery]`）、多余 `<p>` 标签、HTML 实体编码
- [ ] 处理中文文件名与特殊字符（建议统一改成英文/拼音，避免网址出现一长串 `%E4%B8%AD`）

### 阶段 3：历史图片本地化（重点）

- [ ] 统计所有文章里引用的远程图片地址（`<img src="http...">` 与 `![x](http...)`）
- [ ] 编写并运行 Python 脚本：批量下载远程图片 → 存入该文章的**同名资产文件夹**
- [ ] 批量改写正文引用：`![x](https://旧站/wp-content/uploads/2020/01/a.jpg)` → `![x](a.jpg)`
      （**只写文件名**，规则见 [README 第四节](./README.md#四-图片引用规范最重要)）
- [ ] 处理重名图片冲突（不同文章的同名文件互不影响；同一文章内重名需加后缀）
- [ ] 处理下载失败的图片：改用 `wp-content/uploads/` 备份手动补齐
- [ ] 校验：本地 `npm run build` 后检查 `public/posts/*/` 下图片是否齐全
- [ ] 输出迁移报告（成功数 / 失败数 / 失败清单）
- [ ] 全站扫描是否还有遗留的外链图片（应尽量本地化，避免旧站关停后图片全丢）

### 阶段 4：URL 兼容与重定向

- [ ] 梳理 WordPress 旧链接格式（例如 `/archives/123`、`/2020/01/hello.html`）
- [ ] 决定策略：保留旧路径 / 生成静态跳转页 / 依赖搜索引擎重新收录
- [ ] 为高流量旧链接生成 301 跳转（可在 `source/` 下放置带 `<meta refresh>` 的跳转页）
- [ ] 核对新 permalink 规则 `/posts/:title/` 与旧链接的对应关系
- [ ] 迁移完成后提交站点地图，加速搜索引擎更新

### 阶段 5：验收

- [ ] 逐篇抽查：图片显示、代码块高亮、表格、公式、目录
- [ ] 核对分类与标签是否与旧站一致
- [ ] 检查评论：旧站评论无法直接迁移，确认是否需要人工搬运重要评论
- [ ] 确认无死链后，删除示例文章 `hello-world.md` 及其图片文件夹

---

## 三、[功能增强与体验]

### 已完成

- [x] 本地前端搜索（Fluid 内置，已验证生成 `/local-search.xml`）
- [x] 代码高亮（highlight.js，见 `_config.yml`）
- [x] 图片懒加载（Fluid 内置 + `marked.lazyload`）
- [x] 暗色模式（Fluid 内置，Giscus 主题随站点明暗自动切换）
- [x] 404 页面（Fluid 内置，5 秒后跳回首页）

### 待办

- [ ] **Giscus 主题配色微调**：改用 Fluid 官方配色 CSS
      （`_config.fluid.yml` 里 `theme-light` / `theme-dark` 换成注释中的两个 URL）
- [ ] **Giscus 交互微调**：按需调整 `reactions-enabled`、`input-position`，或改用 `mapping: og:title`
- [ ] RSS 订阅：集成 `hexo-generator-feed`，并在导航栏加订阅入口
- [ ] 站点地图：集成 `hexo-generator-sitemap`，提交到 Google / Bing / 百度
- [ ] 图片优化：构建期压缩与 WebP 转换，降低首屏流量
- [ ] 阅读体验：确认 Fluid 的字数统计 / 阅读时长 / 文章目录（TOC）符合预期
- [ ] 首页封面：为文章统一定制 `index_img`（注意必须是 `/img/xxx.png` 根路径写法）
- [ ] 上一篇 / 下一篇导航：确认开启并调整样式
- [ ] 访问统计：接入 umami 或同类方案（Fluid 的 `web_analytics`）
- [ ] 评论区新评论邮件通知（通过 GitHub Discussions 的 Watch 设置）
- [ ] 自定义域名（如将来需要，先配置 CNAME 再改 `_config.yml` 的 `url` 与 `root`）
- [ ] 依赖升级机制：定期 `npm outdated` 并升级 Hexo / Fluid 版本

---

## 四、变更记录

> 每次对配置或目录结构做出实质性变更，都在此追加一行，方便回溯「什么时候改了什么」。

| 日期 | 变更内容 |
| --- | --- |
| 2026-09-26 | 项目初始化：Hexo 8 + Fluid 1.9（npm 方式）+ GitHub Actions 部署流水线骨架 |
| 2026-09-26 | 开启 `post_asset_folder`，实测确认「正文图片只写文件名」的相对路径规则，并写入 README |
| 2026-09-26 | 接入 Giscus，预填 `repo` / `repo-id`；`category-id` 待管理员从 giscus.app 获取 |
| 2026-09-26 | 补充「关于」页，消除导航栏 `/about/` 死链 |
| 2026-09-26 | 发现本仓库默认工作流权限为 read-only，在 workflow 中显式声明 `permissions: contents: write` |
| 2026-09-26 | 移除 `hexo-generator-search`：Fluid 主题自带搜索索引生成器，装插件会产出多余文件 |
| 2026-09-26 | 设置 `timezone: Asia/Shanghai` 与 `updated_option: empty`，修正 CI 环境下的时间问题 |
| 2026-09-26 | 开启仓库 Discussions，经 GraphQL 取得分类 ID `DIC_kwDOPBveyc4DGe0K` 并写入配置 |
| 2026-09-26 | 修复 `package-lock.json` 与 `package.json` 不同步问题（会导致 CI 的 `npm ci` 失败） |
| 2026-09-26 | 首次推送 `main`，Actions 构建成功，`gh-pages` 分支自动生成 |
| 2026-09-26 | Pages 发布来源切换为 `gh-pages` 并触发构建，<https://wzqvip.github.io> 线上验收通过 |
| 2026-09-26 | 实测确认：正文图片只写文件名的相对路径方案在线上正确解析（`/posts/hello-world/cover.png`） |

---

## 五、文档维护约定

- 完成一个任务，**立即**把 `[ ]` 改成 `[x]`，不要攒着一起改
- 新增任务写进对应看板，并尽量写清「为什么做」和「验收标准」
- 任何涉及**配置项或目录结构**的变更，都要同步更新 `README.md`（事实）和本文件的变更记录
- 「当前阻塞项」表格只保留真正卡住线上功能的事项，解决后立刻移除
