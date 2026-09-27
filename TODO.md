# TODO —— 项目状态看板

> 本文件是项目的「状态仪表盘」，记录**进行中的进度**（迁移、待办、迭代计划）。
> 稳定的事实与操作说明请查 [`README.md`](./README.md)。
>
> 状态标签：`[ ]` 未完成 ｜ `[x]` 已完成
>
> **最后更新：2026-09-26**

---

## ✅ 当前无阻塞项

初始化全部完成，网站与评论系统均已线上验证可用：

- **站点**：<https://wzqvip.github.io> —— 首页 / 文章页 / 封面图 / 关于页 / 归档页 / 搜索索引 全部返回 200
- **评论**：Giscus 校验接口返回仓库 ID 与 6 个讨论分类，确认 App 已安装并授权

剩余事项都属于「锦上添花」的个人化与功能增强，见下方各看板。

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
- [x] 安装 Giscus App 到仓库（浏览器手动完成一次授权）
- [x] 验证评论系统配置：`https://giscus.app/api/discussions/categories?repo=wzqvip/wzqvip.github.io`
      返回仓库 ID 与 6 个讨论分类；对照组 `octocat/Hello-World`、`torvalds/linux`
      返回 `giscus is not installed on this repository`，反证本仓库安装有效
- [x] 把这条自检命令写入 README，作为日后排查评论问题的第一手段

### 待办

- [x] 站点信息转正式：`title` = **塔可随记**、`subtitle` = 记录用、
      `author` = **塔可taco**、`description` / `keywords` 已补
- [x] 「关于」页信息：昵称改为「塔可taco」，简介「在读大学生 / 嵌入式开发工程师」
- [x] 首页改成**两列瀑布流**（22 篇文章自动挑到预览图，没图的保持无图、不再硬塞占位图）
- [x] 「拆解」类文章移出首页，独立成 <https://wzqvip.github.io/teardown/> 板块
- [x] **「关于」页头像同步 GitHub**：`about.avatar` 指向
      `https://github.com/wzqvip.png?size=240`，以后换 GitHub 头像会自动跟着变
- [ ] 把 `favicon` 换成自己的图标（现在是主题自带的 Fluid 图标；
      也可直接指向同一个 GitHub 头像地址）
- [ ] 首页横幅图还是主题默认图，可换成自己的照片
      （`_config.fluid.yml` → `index.banner_img`，图片放 `source/img/`）
- [ ] 3 篇文章的封面偏重（`flipper-zero` 1159 KB、`flipper-zero-avr-flasher-arduino` 798 KB、
      `pyqt-gui` 595 KB）—— 原图就没有小尺寸变体，配合懒加载问题不大，
      真要优化可缩小后再换

---

## 二、[数据迁移追踪] ✅ 已完成

> 背景：历史内容经历了 **Typecho → WordPress → Hexo** 两次搬迁。
> 已于 **2026-09-26** 完成，结论与转换规则见 [README 第九节](./README.md#九wordpress-迁移记录)。

### 迁移结果

- [x] 从 WordPress 取得 MySQL 转储（`blog_tacoin_site` 库）与 `wp-content` 全量压缩包
- [x] 迁移已发布文章 **35 篇** → `source/_posts/`
- [x] 迁移「关于我」页面 → `source/about/index.md`（纯文本 ASCII 科技树用代码块保住排版）
- [x] 迁移草稿 1 篇 → `source/_drafts/mate-xs2.md`（不会发布）
- [x] 图片与附件 **185 个 / 91 MB** 本地化到各文章的同名资产文件夹
- [x] 正文引用批量改写为**裸文件名**（`![x](cover.png)`），符合 `post_asset_folder` 规则
- [x] 旧站站内链接重映射到新 permalink（全站 3 处，已全部处理）
- [x] 处理重名冲突（同一文章内同名文件自动加 `-2` 后缀）
- [x] 短代码转换：`[caption]` 展开、`[collapse]` → `<details>`、`[github]` → 链接
      （`[xxx]` / `[MISSING DATASHEET]` 是正文里的字面文字，刻意未动）
- [x] 自动生成 `description`（取 `<!-- more -->` 之前内容作首页摘要）
- [x] 本地构建校验：**126 个页面 / 444 处站内资源引用，失效 0**
- [x] 输出迁移脚本 `tools/migrate-wordpress.mjs`（可重复运行，支持 `--dry-run`）
- [x] 原始导出文件移出仓库（SQL 转储含 `wp_users` 密码哈希，**绝不能提交**）

### 刻意跳过的内容

安装器自带、无实际价值的示例，不迁移：

- [x] `hello-world`「世界，您好！」（WordPress 默认文章，且会与本站示例文章 slug 撞车）
- [x] `start`「欢迎使用 Typecho」（Typecho 默认文章）
- [x] `sample-page`「示例页面」（WordPress 示例页面）
- [x] `privacy-policy`（WordPress 自动生成的隐私政策草稿，正文是待填模板且含内网 IP）

### 待办

- [x] **两张第三方外链图已本地化**（原来是厂商官网的外链，怕站点关停就废了）：
      - `edit.wpgdadawant.com/.../6.jpg` → `td-owc-thunderbolt4-hub-teardown/jhl8440-controller.jpg`（952×606）
      - `www.acp-tech.com/.../78de1174….jpg` → `td-totu-18-in-1-…-teardown/thunderbolt3-jhl7440-module.jpg`（800×800）
      已改写为裸文件名。**全站现在只剩关于页头像一处外站图片**（那是故意同步 GitHub 的）
- [ ] 逐篇人工抽查排版（重点看 `[collapse]` 折叠块、规格表、代码块）
- [ ] 核对分类（8 个）与标签（49 个）是否需要合并精简
- [ ] 旧站评论无法自动迁移；如需保留，从旧站评论表 / Discussions 人工搬运
- [ ] 决定示例文章 `hello-world` 的去留：它现已重写为「蓝色大肥鱼自白」展示页
      （4 张表情包 + 真实 token 账单 + 全部原始示例），可留作门面；不想留则连同
      `source/_posts/hello-world/` 整个文件夹一起删
- [ ] 仓库瘦身（可选）：91 MB 里含一个 40 MB 群晖套件 `.zip` 与 12.7 MB `.spk`，
      嫌重可改用 GitHub Release 托管
- [ ] 旧站 `blog.tacoin.site` 若确定关停：确认无其他引用；如需要可为旧链接做 301 跳转

### 旧 slug → 新 slug 对照（将来做重定向时用得上）

| 旧 slug | 新 slug |
| --- | --- |
| `3` | `docker-adguard-home` |
| `4` | `openwrt-cloudflare-ddns` |
| `11` | `https-ssl` |
| `13` | `wrt-argon` |
| `18` | `pyqt-gui` |
| `23` | `网管交换机实现单线复用` |
| `36` | `群晖需要映射哪些端口` |
| `39` | `adguard-dns` |
| `43` | `pve-guest-agent` |
| `47` | `猫猫头使用Mixin创建自定义规则` |
| `49` | `pve-web` |
| `50` | `wes-2024` |
| `57` | `PVE虚拟机磁盘缓存策略对比` |
| `67` | `geekpie-2024-a-e` |
| `83` | `linux-ssh` |
| `84` | `PVE-初始化设置` |
| `91` | `群晖旧版本套件存档-6.2.3` |
| `94` | `intel-be200-wifi-7` |
| `98` | `openwrt-wireguard` |
| `105` | `flipper-zero` |
| `111` | `vocechat-im` |
| `112` | `群晖NAS直连电脑配置方式` |
| `124` | `tobiiscreentime-tobii-software-download` |
| `134` | `flipper-zero-avr-flasher-arduino` |
| `136` | `cloudflare-2025` |
| 4 个百分号编码的中文 slug | `wordpress-cloudflare-rules`、`pve-ubuntu-debian`、`dji-osmo-pocket3`、`俄亥俄-美卡小记-F1学生篇` |
| 6 个 `td-*-teardown` | 原样保持不变 |

---

## 三、[功能增强与体验]

### 已完成

- [x] 本地前端搜索（Fluid 内置，已验证生成 `/local-search.xml`）
- [x] 代码高亮（highlight.js，见 `_config.yml`）
- [x] 图片懒加载（Fluid 内置 + `marked.lazyload`）
- [x] 暗色模式（Fluid 内置，Giscus 主题随站点明暗自动切换）
- [x] 404 页面（Fluid 内置，5 秒后跳回首页）
- [x] **首页改为两列瀑布流**：预览图（`index_img`）+ 卡片面板 / 圆角 / 悬停浮起，
      样式在 `source/css/custom.css`，分栏逻辑在 `source/js/custom.js`
- [x] **「拆解」独立板块** `/teardown/`：响应式卡片网格 + 封面图 + 导航栏入口
- [x] 首屏横幅高度 100vh → 70vh：之前要滚一整屏才看得到文章
- [x] 首页副标题改为随机显示 4 条（`index.slogan.text` 列表）

### 待办

- [ ] **Giscus 主题配色微调**：改用 Fluid 官方配色 CSS
      （`_config.fluid.yml` 里 `theme-light` / `theme-dark` 换成注释中的两个 URL）
- [ ] **Giscus 交互微调**：按需调整 `reactions-enabled`、`input-position`，或改用 `mapping: og:title`
- [ ] RSS 订阅：集成 `hexo-generator-feed`，并在导航栏加订阅入口
- [ ] 站点地图：集成 `hexo-generator-sitemap`，提交到 Google / Bing / 百度
- [ ] 图片优化：构建期压缩与 WebP 转换，降低首屏流量
- [ ] 阅读体验：确认 Fluid 的字数统计 / 阅读时长 / 文章目录（TOC）符合预期
- [ ] 上一篇 / 下一篇导航：确认开启并调整样式
- [ ] 访问统计：接入 umami 或同类方案（Fluid 的 `web_analytics`）
- [ ] 评论区新评论邮件通知（通过 GitHub Discussions 的 Watch 设置）
- [ ] 自定义域名（如将来需要，先配置 CNAME 再改 `_config.yml` 的 `url` 与 `root`）
      ⚠️ **同时必须把新域名加进 `giscus.json` 的 `origins`**，否则评论区会加载不出来
- [ ] 若开启过严格标题匹配后再迁移仓库：检查已有讨论是否都带 SHA-1 哈希（见 README）
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
| 2026-09-26 | 升级 workflow：`actions/checkout@v7`、`actions/setup-node@v7`，构建 Node 版本 20 → 24（Node 20 已 EOL） |
| 2026-09-26 | 安装 Giscus App；用 giscus 校验接口 + 对照组确认授权有效，自检命令写入 README |
| 2026-09-26 | 完成 WordPress 迁移：35 篇文章 + 关于页 + 1 篇草稿 + 185 个资产（91 MB），站内引用校验 0 失效 |
| 2026-09-26 | 新增 `tools/migrate-wordpress.mjs`（MySQL 转储 → Hexo Markdown，一次性工具，支持 --dry-run） |
| 2026-09-26 | 关闭 Fluid 默认的 `/links/` 友链页：内容是主题作者的示例友链，且引用了主题未自带的 `/img/favicon.png`（会 404） |
| 2026-09-26 | 移除已无必要的 `source/_posts/.gitkeep`（该目录已有真实内容） |
| 2026-09-26 | 重写 `hello-world` 为展示页：新增 4 张表情包与真实 token 账单，4 组原始示例全部保留 |
| 2026-09-26 | 站点更名「塔可随记」：title / author(塔可taco) / subtitle(记录用) / about 昵称与简介 |
| 2026-09-26 | 首页从「单栏流水」改为两栏布局：新增 `source/css/custom.css`，22 篇文章自动挑到预览图 |
| 2026-09-26 | 「拆解」类文章移出首页，新增 `/teardown/` 独立板块页（`scripts/teardown.js`）+ 导航栏入口 |
| 2026-09-26 | 修复构建噪音：`scripts/` 是 Hexo 插件目录，迁移脚本放这里每次构建都报 Script load failed，已移到 `tools/` |
| 2026-09-26 | 新增 `tools/pick-covers.mjs`：按清晰度/宽高比/体积自动为文章挑首页封面 |
| 2026-09-26 | 首屏横幅 100vh → 70vh；拆解页日期改用 Hexo 核心 date 助手，修正 UTC 导致的差一天 |
| 2026-09-26 | hello-world 的「主人说过的话」按真实对话重写（把「嗯嗯啊啊」换成真实发言 + 我做了什么） |
| 2026-09-26 | 修复 Markdown 中文标点坑：`**「x」**` 加粗失效，改为 `「**x**」`；已写入 README 常见问题 |
| 2026-09-26 | 改用**瀑布流**替代网格：网格同行必然等高、有无配图混排必有留白，而原生 `grid-template-rows: masonry` Chrome 153 仍不支持 → 新增 `source/js/custom.js` 分栏 |
| 2026-09-26 | 撤销上面那次「生成占位封面」的做法并删除 `tools/gen-covers.mjs`：没配图的文章就保持无图，由瀑布流自然错开 |
| 2026-09-26 | 「关于」页头像改为同步 GitHub：`about.avatar` → `https://github.com/wzqvip.png?size=240` |
| 2026-09-26 | 两张第三方外链图本地化进各自文章的资产文件夹，改写为裸文件名；README 里那节说明已删除 |
| 2026-09-26 | Giscus 加固：开启严格标题匹配 `strict: 1`（趁尚无讨论，零迁移成本）；新增 `giscus.json` 域名白名单防盗用 |

---

## 五、文档维护约定

- 完成一个任务，**立即**把 `[ ]` 改成 `[x]`，不要攒着一起改
- 新增任务写进对应看板，并尽量写清「为什么做」和「验收标准」
- 任何涉及**配置项或目录结构**的变更，都要同步更新 `README.md`（事实）和本文件的变更记录
- 「当前阻塞项」表格只保留真正卡住线上功能的事项，解决后立刻移除
