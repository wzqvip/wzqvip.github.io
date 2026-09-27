# wzqvip 的博客

基于 **Hexo** 的静态博客，托管在 **GitHub Pages**，由 **GitHub Actions** 全自动构建发布，
评论系统使用 **Giscus**（基于 GitHub Discussions，无后端、无数据库）。

> **这份 README 是本项目唯一的「真相之源」。**
> 所有维护操作（写文章、传图片、改配置）都可以在 GitHub 网页端完成，不需要在电脑上装任何环境。

- 线上地址：<https://wzqvip.github.io>
- 源码仓库：<https://github.com/wzqvip/wzqvip.github.io>

---

## 目录

1. [技术栈与工作原理](#一技术栈与工作原理)
2. [⚠️ 一次性初始化（只需做一次）](#二️-一次性初始化只需做一次)
3. [日常维护：零配置 Web 工作流](#三日常维护零配置-web-工作流)
4. [📷 图片引用规范（最重要）](#四-图片引用规范最重要)
5. [Giscus 配置备忘](#五giscus-配置备忘)
6. [本地预览（可选）](#六本地预览可选)
7. [常见问题排查](#七常见问题排查)
8. [文件职责速查表](#八文件职责速查表)

---

## 一、技术栈与工作原理

| 组件 | 作用 |
| --- | --- |
| **Hexo 8** | 把 Markdown 编译成静态 HTML |
| **Fluid 主题 1.9** | 页面外观，通过 npm 安装（**不在 `themes/` 目录里**） |
| **GitHub Actions** | 每次提交自动编译并发布 |
| **GitHub Pages** | 免费托管编译产物 |
| **Giscus** | 评论系统，评论存在本仓库的 Discussions 里 |

### 发布流程

```
你改 Markdown / 图片
        │  git push（或在网页端直接提交）
        ▼
   main 分支（只放「源文件」：md、图片、配置）
        │  触发 .github/workflows/deploy.yml
        ▼
   GitHub Actions 在云端 npm install + hexo generate
        │
        ▼
   产物推送到 gh-pages 分支（只放「编译结果」：html/css/js）
        │
        ▼
   GitHub Pages 读取 gh-pages 分支 → https://wzqvip.github.io
```

**你只需要关心 `main` 分支。`gh-pages` 分支是机器自动生成的，绝对不要手动去改它。**

---

## 二、✅ 一次性初始化（已全部完成）

| # | 步骤 | 状态 |
| --- | --- | --- |
| 1 | 开启仓库 Discussions | ✅ 已完成（2026-09-26） |
| 2 | 取得并填写 `giscus.category-id` | ✅ 已完成 |
| 3 | 安装 **Giscus App** 到本仓库 | ✅ 已完成 |
| 4 | Pages 发布来源改为 `gh-pages` 分支 | ✅ 已完成 |
| 5 | 确认工作流权限 | ✅ 无需操作 |

网站和评论系统都已上线验证可用。下面记录完整操作过程，
**只有重建仓库或迁移到新仓库时才需要重做**。

<details>
<summary>📎 展开查看：5 个步骤的完整操作（含一条自检命令）</summary>

#### ① 开启 Discussions

1. 打开 <https://github.com/wzqvip/wzqvip.github.io/settings>
2. **Features** 区域勾选 **Discussions**，保存

开启后 GitHub 会自动建好 6 个默认分类（Announcements / General / Ideas / Polls / Q&A / Show and tell）。

#### ② 安装 Giscus App

Giscus 需要以「GitHub App」的身份在仓库里创建讨论帖，所以必须安装一次。
⚠️ **这一步只能手动做**：安装 GitHub App 必须走浏览器授权流程，命令行无法代做。

1. 打开 <https://github.com/apps/giscus>
2. 点绿色的 **Install** 按钮
3. **Repository access** 选 **Only select repositories**，只勾选 `wzqvip.github.io`
   （不建议选 All repositories）
4. 点 **Install** 完成授权

#### ③ 取得 `category-id`

开启 Discussions 后，用 GraphQL 查分类 ID：

```bash
gh api graphql -f query='{ repository(owner:"wzqvip", name:"wzqvip.github.io") {
  discussionCategories(first:25) { nodes { id name } } } }'
```

也可以直接开 <https://giscus.app/zh-CN> 按提示生成。
本仓库 `Announcements` 分类的实际 ID 是 `DIC_kwDOPBveyc4DGe0K`，已写入 `_config.fluid.yml`。

#### ④ 把 Pages 来源改成 `gh-pages`

```bash
gh api -X PUT repos/wzqvip/wzqvip.github.io/pages \
  -H 'Content-Type: application/json' \
  -f source='{"branch":"gh-pages","path":"/"}'
```

或在网页端：Settings → Pages → Source 选 **Deploy from a branch** →
Branch 选 **`gh-pages`** → 目录选 **`/ (root)`**。

> 这一步必须在 `gh-pages` 分支已经被 Actions 创建出来之后才能做。
>
> 💡 实测经验：**切换来源后 GitHub 不会自动重新构建**，页面可能一直停在
> 「building」甚至返回 404。此时手动触发一次构建即可：
>
> ```bash
> gh api -X POST repos/wzqvip/wzqvip.github.io/pages/builds
> ```
>
> 或在 Actions 页面手动重跑 `pages-build-deployment`。

#### ⑤ 工作流权限

`.github/workflows/deploy.yml` 里已显式声明 `permissions: contents: write`。
本仓库的「默认工作流权限」虽然是 read-only，但**工作流内声明可以覆盖默认值**，
所以不需要去改仓库设置。万一将来推送 `gh-pages` 报 `403`，再去
<https://github.com/wzqvip/wzqvip.github.io/settings/actions>
把 **Workflow permissions** 改成 **Read and write permissions**。

</details>

### 🔍 一条命令自检 Giscus 是否配置正确

之后如果评论出问题，这条命令能直接告诉你卡在哪一步，**不用打开浏览器**：

```bash
curl -s "https://giscus.app/api/discussions/categories?repo=wzqvip/wzqvip.github.io"
```

| 返回结果 | 含义 |
| --- | --- |
| ✅ 仓库 ID + 分类列表 | 一切正常（2026-09-26 实测返回 6 个分类） |
| ❌ `{"error": "giscus is not installed on this repository"}` | **Giscus App 没装**，见上面第 ② 步 |
| ❌ 其他错误 | 按错误文字判断是公开性、Discussions 还是分类 ID 的问题 |

> 这条命令用的正是 giscus.app 配置页背后调用的校验接口。它必须凭
> 「Giscus App 在该仓库的安装凭证」才能列出讨论分类，
> 所以**能返回分类就等于「App 已正确安装并授权」**，这是最可靠的判断依据。

---

## 三、日常维护：零配置 Web 工作流

### 3.1 打开网页版编辑器

在仓库任意页面按键盘上的 <kbd>.</kbd>（句号）键，
会用 `github.dev` 打开一个完整的 **网页版 VS Code**，无需安装任何东西。

> 也可以把网址里的 `github.com` 手动改成 `github.dev`，效果一样。

### 3.2 新建一篇文章

**方式 A：网页版编辑器（推荐，能同时建图片文件夹）**

1. 在左侧文件树找到 `source/_posts/`
2. 右键 → **New File**，文件名写 `我的文章.md`
   > 文件名会成为网址的一部分：`我的文章.md` → `/posts/我的文章/`
   > **建议用英文或拼音**，中文会被转义成一长串 `%E6%88%91...`，链接不好看也不好分享。
3. 右键 `source/_posts/` → **New Folder**，建一个**完全同名**的文件夹 `我的文章/`
4. 把图片拖进 `我的文章/` 文件夹
5. 写正文（参考下面的[图片引用规范](#四-图片引用规范最重要)）
6. 左侧源代码管理面板 → 写提交信息 → **Commit & Push**

**方式 B：直接在 GitHub 网页上新建**

1. 打开 <https://github.com/wzqvip/wzqvip.github.io/new/main/source/_posts>
2. 文件名填 `我的文章.md`，内容最上方必须有 front-matter（见下）
3. 提交后，再单独上传图片到同名文件夹（`Add file` → `Upload files` 时，
   在文件名里带上文件夹名，例如 `我的文章/cover.png`，GitHub 会自动建目录）

### 3.3 文章的 front-matter（头部信息）

每篇文章开头的 `---` 之间的部分：

```yaml
---
title: 文章标题            # 显示在页面上的标题
date: 2024-06-01 10:00:00  # 发布时间，务必手写，否则会取构建时刻
tags:
  - 标签A
categories:
  - 分类B
description: 一句话摘要，用于搜索引擎和分享卡片
# index_img: /img/xxx.png  # 首页卡片封面（注意：要写 /img/ 开头的根路径）
---
```

> ⚠️ **`date` 一定要手写。** 如果省略，Hexo 会取文件时间，
> 而在 Actions 环境里文件时间是「构建那一刻」，每次发布都可能变。

### 3.4 修改站点标题、作者等

编辑根目录 `_config.yml` 最上面的 `# Site` 区域，提交即可：

```yaml
title: wzqvip 的博客     # ← 改成你的站点名
author: wzqvip           # ← 改成你的署名
subtitle: ''
description: ''
```

### 3.5 修改主题外观

编辑根目录 `_config.fluid.yml`。**不需要**把官方配置整份复制过来，
只写要改的那几项就行，其余自动沿用主题默认值。

> 完整可改项清单在 `node_modules/hexo-theme-fluid/_config.yml`
> （该文件只在本地 `npm install` 后存在，也可以在
> [GitHub 上查看](https://github.com/fluid-dev/hexo-theme-fluid/blob/master/_config.yml)）。

### 3.6 查看部署状态

每次推送后，打开 <https://github.com/wzqvip/wzqvip.github.io/actions>
可以看构建进度。绿色 ✅ 表示已上线，红色 ❌ 表示构建失败，点进去看日志。

---

## 四、📷 图片引用规范（最重要）

本项目开启了 Hexo 的 `post_asset_folder`（文章同名资产文件夹），
**文章和它的图片文件夹必须同名并放在一起**：

```
source/_posts/
├── hello-world.md          ← 文章本体
└── hello-world/            ← 同名文件夹，专门放这篇的图片
    ├── cover.png
    └── sub/
        └── pic.png         ← 支持子目录
```

### 构建后图片去哪了

```
文章页面： https://wzqvip.github.io/posts/hello-world/
图片：     https://wzqvip.github.io/posts/hello-world/cover.png
```

图片被发布到**和文章页面同一个目录**下。

### 因此，正文里要「只写文件名」

| Markdown 写法 | 实际生成 | 结果 |
| --- | --- | --- |
| `![封面](cover.png)` | `/posts/hello-world/cover.png` | ✅ **推荐** |
| `![封面](./cover.png)` | `/posts/hello-world/cover.png` | ✅ |
| `![封面](sub/pic.png)` | `/posts/hello-world/sub/pic.png` | ✅ 子目录 |
| `![封面](hello-world/cover.png)` | `/hello-world/cover.png` | ❌ **图片裂开** |
| `![封面](/posts/hello-world/cover.png)` | 同上 | ⚠️ 能显示，但改文件名就失效 |

> **最常见的错误就是多写了一层文件夹名。**
> 记住口诀：**文章里写图片，只写文件名。**

这一行为由 `_config.yml` 里的两项共同保证，**请不要改动**：

```yaml
post_asset_folder: true   # 开启文章同名资产文件夹
marked:
  prependRoot: true       # 给站内图片路径补上 /
  postAsset: true         # 把文件名解析成资产文件夹里的真实地址
```

### 特殊情况：首页封面图（`index_img` / `banner_img`）

这两个是 **front-matter** 里的字段，**不走**上面的解析规则，
必须写「以 `/` 开头的站点根路径」：

1. 把图片放到 `source/img/`（这个目录是公共图片库，不是某篇文章专属）
2. front-matter 里写 `index_img: /img/xxx.png`

> 如果写 `index_img: cover.png`，会变成 `/cover.png` → 404。

---

## 五、Giscus 配置备忘

| 项目 | 当前值 |
| --- | --- |
| 评论系统 | Giscus（基于 GitHub Discussions） |
| 绑定仓库 | `wzqvip/wzqvip.github.io` |
| 仓库 ID（`repo-id`） | `R_kgDOPBveyQ` |
| 讨论分类 | `Announcements` |
| 分类 ID（`category-id`） | `DIC_kwDOPBveyc4DGe0K` |
| Giscus App 安装 | ✅ 已安装并授权 |
| 映射规则（`mapping`） | `pathname` |
| 严格标题匹配（`strict`） | `1`（已开启） |
| 防盗用限制 | 根目录 `giscus.json`，仅允许本站 + giscus.app + 本地预览 |
| 配置位置 | 根目录 `_config.fluid.yml` → `giscus` 段 |

### 映射规则说明

`mapping: pathname` 表示**用页面路径关联讨论帖**：

- 页面 `https://wzqvip.github.io/posts/hello-world/`
  → giscus 用的搜索词是 `posts/hello-world/`（去掉开头的 `/`，再切掉 `.html` 之类后缀）
  → 它会找**标题中包含**这段文字的讨论
- 好处：**以后改文章标题，已有评论不会丢**（因为搜的是路径，不是标题）
- 代价：如果你改了文件名（等于改了网址），旧评论会「找不到」，等于开一个新讨论

> 💡 **改文件名 = 换网址 = 评论重新开始。** 想保留评论就不要改已发布文章的 `source/_posts/` 下的文件名。

其他可选值：`url`（用完整网址）、`title`（用页面标题）、`og:title`、`specific`、`number`。

### giscus.app 配置页怎么填（对照表）

<https://giscus.app/zh-CN> 只是**配置生成器 / 校验器**，它不会写回你的仓库。

> ⚠️ **不要把页面上生成的那段 `<script>` 贴进博客。**
> Fluid 主题已经自动生成这段代码了（可以在线上页面源码里搜 `var options =` 看到），
> 再贴一遍会出现**两个评论框**。
> 这个页面的正确用途只有两个：① 确认三个前置条件；② 取 `category-id`。

要在页面上对照检查时，按下表选：

| 页面上的选项 | 选什么 | 对应本项目的配置项 |
| --- | --- | --- |
| 仓库 | `wzqvip/wzqvip.github.io` | `repo` |
| 页面 ↔️ discussion 映射关系 | 第 1 项「标题包含页面的 pathname」 | `mapping` |
| 使用严格的标题匹配 | 勾选 | `strict` |
| Discussion 分类 | `Announcements`（公告） | `category` / `category-id` |
| 只搜索该分类中的 discussion | 保持勾选 | 由 `category` 体现 |
| 启用主帖子上的反应 | 勾选 | `reactions-enabled` |
| 输出 discussion 的元数据 | **不**勾选 | `emit-metadata` |
| 将评论框放在评论上方 | 勾选 | `input-position` |
| 懒加载评论 | 不勾 | 未设置 |
| 主题 | ❌ **不要**选「用户偏好的色彩方案」 | 由 `theme-light` / `theme-dark` 接管 |

> **为什么主题不能选「用户偏好的色彩方案」**：那个选项只看**操作系统**的明暗设置。
> Fluid 有站内手动切换按钮，主题模板会读 `data-user-color-scheme` 在
> `theme-light` / `theme-dark` 之间切换；换成 `preferred_color_scheme`
> 会导致「站点切到暗色，评论区还是亮的」。

**要改配置永远改根目录 `_config.fluid.yml` 的 `giscus:` 段**，
提交后 Actions 自动重新部署。在 giscus.app 上点选不会影响你的博客。

### 严格标题匹配（`strict: 1`）

GitHub 搜索讨论用的是**模糊匹配**，标题相近时可能匹配到错误的讨论。
开启后 giscus 改为在讨论**正文里搜索标题的 SHA-1 哈希**来精确定位。

> ⚠️ 官方警告：开启前**已经存在**的讨论必须手工把哈希补进正文，否则会匹配不到。
> 本博客在 2026-09-26 开启此项时还没有任何讨论，因此不需要做任何迁移。
> 但**将来若迁移到新仓库、或先关掉再打开，要先检查是否已有讨论**。

### 防止评论区被别的站点盗用（`giscus.json`）

根目录的 `giscus.json` 用来限制**哪些域名可以加载本仓库的讨论**：

```json
{
  "origins": ["https://wzqvip.github.io", "https://giscus.app"],
  "originsRegex": ["http://localhost:[0-9]+", "http://127\\.0\\.0\\.1:[0-9]+"]
}
```

- `origins`：本站域名，以及 `https://giscus.app`（官方配置页的预览要用）
- `originsRegex`：本地预览（`npm run server` 是 `localhost:4000`）
- 比较方式是**整个字符串完全相等**，不是包含匹配，
  所以 `https://wzqvip.github.io.evil.com` 这种伪造域名会被正确拒绝
- 域名对不上时，giscus 会**直接拒绝加载**

> 🔴 **将来若绑定自定义域名，必须把新域名加进 `origins`**，否则评论区会加载不出来。

### 评论什么时候创建

Giscus 是**懒创建**的：只有当有人**发表第一条评论或表情回应**时，
才会自动在 Discussions 里新建对应讨论帖。没人评论就没帖子，这是正常现象。

---

## 六、本地预览（可选）

只想在网页端写作的话可以跳过本节。想在本地看效果：

```bash
# 需要 Node.js 20 或更高版本（推荐 24 LTS，与线上构建环境保持一致）
npm install          # 安装依赖
npm run server       # 启动本地服务
```

然后访问 <http://localhost:4000>。改文件会自动热更新。

其他命令：

```bash
npm run clean        # 清掉编译缓存（改配置后不生效时先跑这个）
npm run build        # 只编译，产物在 public/
```

> ⚠️ **不要把 `public/` 提交到仓库。** 它已经在 `.gitignore` 里，
> 线上产物由 Actions 生成并推送到 `gh-pages` 分支。

---

## 七、常见问题排查

| 现象 | 原因与解决 |
| --- | --- |
| 图片显示不出来 | 正文里的图片路径多写了一层文件夹名。改成 `![](cover.png)`，见[第四节](#四-图片引用规范最重要) |
| 首页封面图 404 | `index_img` 写成了相对路径。必须写成 `/img/xxx.png` 并放到 `source/img/` |
| 评论区显示配置错误 | 先跑[第二节的自检命令](#-一条命令自检-giscus-是否配置正确)定位：报 App 未安装 / Discussions 未开 / 分类 ID 不对，各有对应处理方式 |
| 推送到 `main` 后网站没变化 | ① 看 [Actions](https://github.com/wzqvip/wzqvip.github.io/actions) 是否构建失败；② 确认 Pages 来源已改成 `gh-pages` 分支 |
| Actions 报 403 / Permission denied | 见[步骤 4](#步骤-4一般不需要确认工作流权限) |
| 文章时间差了 8 小时 | `_config.yml` 里 `timezone` 被改掉了，必须是 `'Asia/Shanghai'` |
| 文章显示的时间对，但归档到了上一个月／上一年 | Hexo 的归档路径按 **UTC** 计算。北京时间凌晨（00:00–07:59）的文章，UTC 还停在前一天，于是会落到上一个归档目录。把发布时间写在 **08:00 之后**即可对齐；只影响 `/archives/` 的目录名，不影响文章页显示的时间 |
| 文章「最后更新」都变成今天 | `_config.yml` 里 `updated_option` 被改回 `mtime` 了。Actions 每次都是全新 clone，所以要用 `empty` |
| 改了配置但线上没反应 | 检查改的是根目录的 `_config.yml` / `_config.fluid.yml`，**不是** `node_modules` 或 `themes/` 里的文件 |
| 搜索结果为空 | 搜索索引是 Fluid 主题自己生成的（`/local-search.xml`），不需要装 `hexo-generator-search` 之类的插件；装重复插件反而会生成多余文件 |

---

## 八、文件职责速查表

| 路径 | 作用 | 能改吗 |
| --- | --- | --- |
| `source/_posts/` | **文章 Markdown 和图片（日常就改这里）** | ✅ 随便改 |
| `source/img/` | 全站公共图片（首页封面、头像、横幅） | ✅ 可新增 |
| `source/about/index.md` | 「关于」页面 | ✅ 可改 |
| `_config.yml` | Hexo 站点级配置（标题、网址、图片路径规则） | ✅ 谨慎改 |
| `_config.fluid.yml` | 主题外观 + Giscus 评论配置 | ✅ 随便改 |
| `giscus.json` | 评论防盗用：允许加载本仓库讨论的域名白名单 | ⚠️ 换域名时必须同步改 |
| `.github/workflows/deploy.yml` | 自动部署流水线 | ⚠️ 改动需谨慎 |
| `scaffolds/post.md` | 新建文章的模板 | ✅ 可改 |
| `package.json` | 依赖清单 | ⚠️ 需懂 npm |
| `themes/` | **故意留空的目录**，主题从 npm 安装 | ❌ 不用管 |
| `public/` | 编译产物，已被 git 忽略 | ❌ 不要提交 |
| `gh-pages` 分支 | 自动生成的线上产物 | ❌ **绝对不要手动改** |

---

## 附：文档维护约定

- 本 `README.md` 记录**稳定的事实**（怎么用、为什么这么设计）
- [`TODO.md`](./TODO.md) 记录**进行中的进度**（迁移、待办、迭代计划）
- 每次配置或结构发生变更，两份文档都要同步更新
