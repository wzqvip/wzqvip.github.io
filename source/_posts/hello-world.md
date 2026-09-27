---
title: Hello World
date: 2024-01-15 10:00:00
tags:
  - 开始
categories:
  - 随笔
description: 这是博客的第一篇文章，同时说明本站的图片引用规范。
---

欢迎来到我的博客。这篇文章由 GitHub Actions 自动构建发布，评论系统使用 Giscus。

<!-- more -->

## 这是一张位于文章资产文件夹里的图片

![示例封面](cover.png)

上面这张图在 Markdown 里写的是：

```markdown
![示例封面](cover.png)
```

**只写文件名**，不要写 `hello-world/cover.png`。原因见下方「图片引用规范」。

## 图片引用规范（重要）

本站开启了 Hexo 的 `post_asset_folder`，每篇文章有一个**同名文件夹**用来放它的图片：

```
source/_posts/hello-world.md      ← 文章
source/_posts/hello-world/        ← 该文章的图片文件夹（同名）
source/_posts/hello-world/cover.png
```

构建后图片会被发布到 `/posts/hello-world/cover.png`，与文章页面
`/posts/hello-world/` 处于同一目录。因此正文里**只写文件名**即可：

| 写法 | 构建结果 | 是否正确 |
| --- | --- | --- |
| `![x](cover.png)` | `/posts/hello-world/cover.png` | ✅ |
| `![x](./cover.png)` | `/posts/hello-world/cover.png` | ✅ |
| `![x](sub/pic.png)` | `/posts/hello-world/sub/pic.png` | ✅ 子目录也可以 |
| `![x](hello-world/cover.png)` | `/hello-world/cover.png` | ❌ 图片裂开 |
| `![x](/posts/hello-world/cover.png)` | 同上 | ⚠️ 能显示，但改标题就失效 |

## 代码块效果

```bash
npm run server   # 本地预览 http://localhost:4000
```

## 新建文章的快捷方式

在 GitHub 网页端按 <kbd>.</kbd> 键打开网页版 VS Code，
在 `source/_posts/` 下新建 `我的文章.md` 和同名文件夹 `我的文章/`，
把图片拖进文件夹，提交即可。
