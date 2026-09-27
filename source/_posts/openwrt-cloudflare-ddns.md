---
title: "OpenWRT路由器配置CloudFlare DDNS"
date: 2024-08-30 17:53:00
categories:
  - "Homelab"
tags:
  - "DDNS"
  - "CloudFlare"
description: "把域名DDNS从腾讯云迁移到了CF，CF更新快，有Origin Rules，各方面明显比较好。 为数不多的缺点是群晖原生不支持CF的DDNS服务，需要用第三方的脚本，这里不想折腾，于是就用路由器负责DDNS，这样也解决了偶尔群晖DDNS解析…"
index_img: "/posts/openwrt-cloudflare-ddns/2468241247.png"
---

把域名DDNS从腾讯云迁移到了CF，CF更新快，有Origin Rules，各方面明显比较好。 为数不多的缺点是群晖原生不支持CF的DDNS服务，需要用第三方的脚本，这里不想折腾，于是就用路由器负责DDNS，这样也解决了偶尔群晖DDNS解析到代理出口（可以通过添加域名白名单解决）。

<!-- more -->

路由器是Openwrt，发现服务里面有动态DNS. 软件包如下：

```
luci-app-ddns    git-23.226.14195-d53cd07    ~13.4 KB    LuCI Support for Dynamic DNS Client (ddns-scripts)
luci-i18n-ddns-zh-cn    git-23.090.62029-650e6d2    ~6.0 KB    Translation for luci-app-ddns - 简体中文 (Chinese Simplified)
ddns-scripts-cloudflare    2.8.2-13    ~4.1 KB    Dynamic DNS Client scripts extension for cloudflare.com API v4 (require curl)
```

> [https://p3terx.com/archives/openwrt-cloudflare-ddns.html](https://p3terx.com/archives/openwrt-cloudflare-ddns.html)
> 这个链接里面的方法不知道什么原因认证失败。 顺便global API也不是那么安全，我们使用新版本的Region。
> 报错日志如下：

```
164102  WARN : CloudFlare reported an error:
 164102       : {"success":false,"errors":[{"code":9103,"message":"Unknown X-Auth-Key or X-Auth-Email"}],"messages":[],"result":null}
```

采用新版本：
部分参考

> [https://blog.gazer.win/essay/openwrt-ddns-with-cloudflare.html](https://blog.gazer.win/essay/openwrt-ddns-with-cloudflare.html)

首先获取API： [CF/API-Tokens](https://dash.cloudflare.com/profile/api-tokens)

![2024-08-30T09:40:34.png](1220979745.png "2024-08-30T09:40:34.png")
点击右上角的创建令牌。
![2024-08-30T09:41:01.png](1420237628.png "2024-08-30T09:41:01.png")
选择第一项区域DNS
![2024-08-30T09:41:20.png](2468241247.png "2024-08-30T09:41:20.png")
第二行，中间部分可以选择特定区域（域名），或者全部。 点击下面的添加更多可以添加多个。
之后就可以拿到API \*\* 这个只会显示一次，如果忘了可以删除或者重新创建。

之后我们配置路由器部分

添加新服务，起个名字，选择cloudflare-v4
![2024-08-30T09:43:17.png](3325457633.png "2024-08-30T09:43:17.png")
参考上图设置。
主机名可以和域名填一样的，注意域名这里要用 *子域名@域名* 的格式。 用户名 *Bearer* ，密码是刚才获取的token。

HTTPS可以勾选，证书输入/etc/ssl/certs或者IGNORE都可以，推荐添加证书（看到的教程都没加，没添加也能用，此处略）

之后保存并应用，然后点一下对应条目的重新加载，上面就会显示已注册的ip了。如果出了问题点编辑，然后看下日志。

成功示例：

174134 : #> /usr/bin/nslookup cloud.tacoin.site >/var/run/ddns/TacoinSite.dat 2>/var/run/ddns/TacoinSite.err
174134 : Registered IP '1.1.1.1' detected
174134 info : Rerun IP check at 2024-08-30 17:41
174134 : Detect local IP on 'network'
174134 : Local IP '1.1.1.1' detected on network 'wan'
174134 : Waiting 600 seconds (Check Interval)
