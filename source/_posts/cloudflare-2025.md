---
title: "新版cloudflare 端口重定向教程 - 2025"
date: 2025-03-13 16:20:00
categories:
  - "Homelab"
tags:
  - "CloudFlare"
  - "DNS"
description: "使用cloudflare origin rules, 将某个域名（例如 blog.tacoin.site)重定向到 带特殊端口的 服务器 (例如 tacoin.site:12345). 这样对于家宽或者同一台公网主机可以部署多个不同域名的服…"
index_img: "/posts/cloudflare-2025/1530449257.png"
---

使用cloudflare origin rules, 将某个域名（例如 blog.tacoin.site)重定向到 带特殊端口的 服务器 (例如 tacoin.site:12345). 这样对于家宽或者同一台公网主机可以部署多个不同域名的服务。

<!-- more -->

首先创建代理的DNS记录

![DNS](3322565546.png "DNS")

![CF](418240096.png "CF")

然后创建规则， 免费版本似乎是限制10条，新版本不显示了不知道是不是去掉限制了。

![创建](1334058421.png "创建")

![设置](3746478769.png "设置")

![端口重定向](1530449257.png "端口重定向")

---

一定要域名本身也托管在cf并且设置了代理才可以，否则流量不经过cloudflare是不能被重定向的
![e.g.](1087988211.png "e.g.")
