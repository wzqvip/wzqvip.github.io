---
title: "宝塔搭建Wordpress搭配Cloudflare Rules报错解决"
date: 2025-07-26 01:41:39
categories:
  - "Server"
tags:
  - "CloudFlare"
  - "Homelab"
description: "大概就是一个比较奇妙的需求。 家宽有公网，但是封了80端口。 于是需要使用自定义端口+Cloudflare Origin Rules重写到80端口实现。 之前Typecho很顺利，但是wordpress遇到了一堆问题。 从这里记录一下解决方…"
index_img: "/img/covers/wordpress-cloudflare-rules.svg"
---

大概就是一个比较奇妙的需求。 家宽有公网，但是封了80端口。 于是需要使用自定义端口+Cloudflare Origin Rules重写到80端口实现。 之前Typecho很顺利，但是wordpress遇到了一堆问题。 从这里记录一下解决方案。

## 页面404

各种php，包括后台都404。 这个比较简单，宝塔/网站/伪静态 设置一下

配置文件

> location /
> {
> try\_files $uri $uri/ /index.php?$args;
> }
>
> rewrite /wp-admin$ $scheme://$host$uri/ permanent;

## 一直跳转/301/302

这个似乎没有人提到过。 这里因为我偷懒，网站是http端口，cloudflare代理之后变成https。 Wordpress似乎因为这里有些奇妙问题导致一直跳转到同一个页面。

> 当你使用 Cloudflare HTTPS 并把请求转发到 **本地 HTTP 端口（2048）** 时，**WordPress 本身默认使用 `siteurl` 和 `home` 字段判断当前地址是否 HTTPS**，若不匹配，会导致 **302 重定向循环**，跳回 HTTPS，然后继续跳 HTTP，再回 HTTPS……

需要修改文件目录下面的 wp-config.php 从文件末尾，注意注释“*That's all, stop editing!*”的位置，加入以下内容

wp-config.php

*/\* Add any custom values between this line and the "stop editing" line. \*/*

if (isset($\_SERVER\['HTTP\_X\_FORWARDED\_PROTO'\]) && $\_SERVER\['HTTP\_X\_FORWARDED\_PROTO'\] === 'https') {
$\_SERVER\['HTTPS'\] = 'on';
}

*/\* That's all, stop editing! Happy publishing. \*/*

Cloudflare 默认会传 `X-Forwarded-Proto: https`，通过这个判断即可让 WordPress 识别为 HTTPS，从而避免重定向。

## 尾声

总之是一些比较严格的检查和判断逻辑。 本地配置https+证书之后是最好的。 cf的TLS协议要选择flexable或者自动，否则也会因为这个原因报错。

从Typecho切换到了Wordpress，当时看着typecho比较新颖，就跟rust一样就选择了，结果是空有其表，入手比较容易，但是后续发现功能和生态都比较欠缺，尤其是平时习惯markdown+Latex语法。 Wordpress算是经久不衰吧。
