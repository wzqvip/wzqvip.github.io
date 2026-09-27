---
title: "Adguard DNS/广告拦截/屏蔽规则"
date: 2024-09-15 22:32:00
categories:
  - "Homelab"
tags:
  - "adguard"
  - "短视频"
  - "广告拦截"
description: "个人使用的一些广告拦截规则与禁用短视频平台规则. 适用Adguard Home, 营造一个良好健康的网络环境. 广告屏蔽,Cookie弹窗拦截,阻止家人刷抖音快手头条等短视频平台. 以及使用加密DNS. Adguard Home/ Pi H…"
index_img: "/img/covers/adguard-dns.svg"
---

个人使用的一些广告拦截规则与禁用短视频平台规则. 适用Adguard Home, 营造一个良好健康的网络环境. 广告屏蔽,Cookie弹窗拦截,阻止家人刷抖音快手头条等短视频平台. 以及使用加密DNS.
Adguard Home/ Pi Hole之类基于DNS的广告拦截并不能拦截youtube广告。需要使用客户端。

<!-- more -->

文末有配置文件。

加密DNS配置，最后的是对国内域名进行国内DNS分流，防止返回境外访问的IP。

```
# 下面的 DNS 组合供选择，选择延迟较低的
# Cloudflare
https://dns.cloudflare.com/dns-query
tls://one.one.one.one
# Google DNS
tls://8888.google
tls://dns.google
tls://dns.google.com
https://dns.google/dns-query
https://dns.google.com/dns-query
https://8888.google/dns-query
h3://dns.google/dns-query
h3://dns.google.com/dns-query
h3://8888.google/dns-query
# OpenDNS
tls://dns.opendns.com
https://doh.opendns.com/dns-query
# Quad9 DNS
tls://dns11.quad9.net
https://dns11.quad9.net/dns-query
# AdGuard DNS
tls://dns.AdGuard-dns.com
https://dns.AdGuard-dns.com/dns-query
quic://dns.AdGuard-dns.com
h3://dns.AdGuard-dns.com/dns-query
# NextDNS
tls://dns.nextdns.io
https://dns.nextdns.io/dns-query
quic://dns.nextdns.io
h3://dns.nextdns.io/dns-query
# 欧盟 DNS
https://zero.dns0.eu/
tls://zero.dns0.eu
quic://zero.dns0.eu
#国内分流
[/csdn.net/]quic://dns.alidns.com
[/dbankcloud.cn/dbankcloud.ru/dbankcloud.com/]quic://dns.alidns.com
[/quark.cn/]quic://dns.alidns.com
[/bytefcdn.com/]quic://dns.alidns.com
[/tencent-cloud.cn/]quic://dns.alidns.com
[/qq.com/]quic://dns.alidns.com
[/tencent-cloud.com/]quic://dns.alidns.com
[/tencentcs.cn/tencentcs.com/]quic://dns.alidns.com
[/qq.com/]quic://dns.alidns.com
[/tencent.com/tencent.cn/]quic://dns.alidns.com
[/sogou.com/]quic://dns.alidns.com
[/wpscdn.cn/]quic://dns.alidns.com
[/xunlei.com/]quic://dns.alidns.com
[/mi.com/]quic://dns.alidns.com
[/miwifi.com/]quic://dns.alidns.com
[/shifen.com/]quic://dns.alidns.com
[/bdurl.net/]quic://dns.alidns.com
[/amemv.com/]quic://dns.alidns.com
[/toutiao.com/]quic://dns.alidns.com
[/zijieapi.com/]quic://dns.alidns.com
[/douyin.com/]quic://dns.alidns.com
[/douyincdn.com/]quic://dns.alidns.com
[/douyinec.com/]quic://dns.alidns.com
[/douyinliving.com/]quic://dns.alidns.com
[/douyinpic.com/]quic://dns.alidns.com
[/douyinstatic.com/]quic://dns.alidns.com
[/douyinvideo.net/]quic://dns.alidns.com
[/douyinvod.click/]quic://dns.alidns.com
[/douyinvod.com/]quic://dns.alidns.com
[/tencent-blackboard.com/]quic://dns.alidns.com
[/tencent-cloud.com/]quic://dns.alidns.com
[/tencent-cloud.net/]quic://dns.alidns.com
[/tencent-gf.com/]quic://dns.alidns.com
[/tencent.com.hk/]quic://dns.alidns.com
[/tencent.com/]quic://dns.alidns.com
[/tencentads.com/]quic://dns.alidns.com
[/tencentcdb.com/]quic://dns.alidns.com
[/tencentclb.com/]quic://dns.alidns.com
[/tencentcloud.com/]quic://dns.alidns.com
[/tencentcloudapi.com/]quic://dns.alidns.com
[/tencentcloudbase.com/]quic://dns.alidns.com
[/tencentcs.com/]quic://dns.alidns.com
[/tencentdba.com/]quic://dns.alidns.com
[/tencentdevices.com/]quic://dns.alidns.com
[/tencentipv6.com/]quic://dns.alidns.com
[/tencentlog.com/]quic://dns.alidns.com
[/tencentmeeting.com/]quic://dns.alidns.com
[/tencentmind.com/]quic://dns.alidns.com
[/tencentmusic.com/]quic://dns.alidns.com
[/tencentsuite.com/]quic://dns.alidns.com
[/tencentwm.com/]quic://dns.alidns.com
[/tencentyun.com/]quic://dns.alidns.com
[/tqqa.com/]quic://dns.alidns.com
[/tqqyun.com/]quic://dns.alidns.com
[/qpic.cn/]quic://dns.alidns.com
[/qlogo.cn/]quic://dns.alidns.com
[/cdnnode.cn/]quic://dns.alidns.com
[/idouyinvod.com/]quic://dns.alidns.com
[/taobao.com/]quic://dns.alidns.com
[/jd.com/]quic://dns.alidns.com
[/baidu.com/]quic://dns.alidns.com
[/gov.cn/]quic://dns.alidns.com
[/bilibili.com/]quic://dns.alidns.com
[/bilivideo.com/]quic://dns.alidns.com
[/bilivideo.cn/]quic://dns.alidns.com
[/cnki.net/]quic://dns.alidns.com
[/hdslb.com/]quic://dns.alidns.com
[/163.com/]quic://dns.alidns.com
[/126.net/]quic://dns.alidns.com
[/huya.com/]quic://dns.alidns.com

```

## 广告拦截-DNS黑名单

**这个不是越多越好**
有的不太重叠,功能不怎么一样,看个人喜好.*目前我是下面的全开了*

```
CHN: anti-AD
https://adguardteam.github.io/HostlistsRegistry/assets/filter_21.txt

halfLife
https://cdn.jsdelivr.net/gh/o0HalfLife0o/list@master/ad.txt

CHN: AdRules DNS List
https://adguardteam.github.io/HostlistsRegistry/assets/filter_29.txt

秋风广告
https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/AWAvenue-Ads-Rule.txt

屏蔽cookies弹窗
https://www.i-dont-care-about-cookies.eu/abp/

广告终结者List
http://sub.adtchrome.com/adt-chinalist-easylist.txt

anti-AD命中率最高列表
https://cdn.jsdelivr.net/gh/privacy-protection-tools/anti-AD@master/anti-ad-easylist.txt

Anti-AD
https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-easylist.txt

```

## 自定义过滤规则

```
#短视频系列的
127.0.0.1 api.gifshow.com
127.0.0.1 jsmov2.a.yximgs.com
127.0.0.1 txmov2.a.yximgs.com
127.0.0.1 alimov2.a.yximgs.com
127.0.0.1 apissl.gifshow.com
127.0.0.1 api.gifshow.com
127.0.0.1 js2.a.yximgs.com
127.0.0.1 tx2.a.yximgs.com
127.0.0.1 bd.a.yximgs.com
127.0.0.1 ali2.a.yximgs.com
127.0.0.1 aliimg.a.yximgs.com
127.0.0.1 qn.a.yximgs.com
127.0.0.1 ipdispatch.live.xycdn.com
127.0.0.1 ipdispatch.live.xycdn.com
127.0.0.1 sdk.open.phone.igexin.com
127.0.0.1 upload.gifshow.com
127.0.0.1 api.ksapisrv.com
127.0.0.1 sf2018-api.gifshow.com
127.0.0.1 c-hzgt2.getui.com
127.0.0.1 umc.danuoyi.alicdn.com
127.0.0.1 sdk.conf.igexin.com
127.0.0.1 qnmov.a.yximgs.com
127.0.0.1 upload.ksapisrv.com
127.0.0.1 sdkoptedge.chinanetcenter.com
127.0.0.1 c-hzgt2.getui.com
127.0.0.1 upload.ksapisrv.com
127.0.0.1 static.yximgs.com
127.0.0.1 apissl.ksapisrv.com
127.0.0.1 ntp.nc.gifshow.com
127.0.0.1 bd-livemate.pull.yximgs.com
127.0.0.1 bd.pull.yximgs.com

||pull.yximgs.com^
||yximgs.com^
||etoote.com^
||bcelive.com^
||gifshow.com^
||httpdns.c.cdnhwc2.com^
||jscmmov.a.etoote.com^
||bdcm.a.etoote.com^
||bdcmmov.a.etoote.com^
||alicmmov.a.etoote.com^
||api.e.kuaishou.com^
||js-rwk.pull.etoote.com^
||ulog.ksapisrv.com^
||ulog.gifshow.com^
||apinew.gifshow.com^
||umc.danuoyi.alicdn.com^
||apihn1.ksapisrv.com^
||infra-admin.corp.kuaishou.com^
||api.kwaizt.com^
||ksapisrv.com^
||corp.kuaishou.com^
||kwaizt.com^
||sdkoptedge.chinanetcenter.com^
||chinanetcenter.com^
||kuaishou.com^
||www.kuaishou.com^
||douyin.com^$important
||douyincdn.com^$important
||toutiao.com^$important
||snssdk.com^$important
||ixigua.com^$important
||amemv.com^$important
||bytedance.net^$important
||bdurl.net^$important
||douyincdn.com^$important
||yximgs.com^$important||douyin.com^$important
||douyincdn.com^$important
||toutiao.com^$important
||snssdk.com^$important
||ixigua.com^$important
||amemv.com^$important
||bytedance.net^$important
||bdurl.net^$important
||douyincdn.com^$important
||yximgs.com^$important
```

已阻止的服务那里面基本上是境外和有名的一些境内平台,快手头条这写没有,用的自定义规则来屏蔽.

致谢
[屏蔽快手的Adblock规则](https://hostloc.com/thread-714189-1-1.html)
[N1 ADGuard 如何屏蔽抖音快手等短视频平台？](https://www.right.com.cn/forum/thread-3960431-1-1.html)
[秋风广告规则-开源社区中最优秀的广告过滤器列表之一，实现了最优秀的广告拦截、隐私保护和流量节省](https://github.com/TG-Twilight/AWAvenue-Ads-Rule)
以及其他所有致力于营造更好环境的开发者. *(忘了从哪里找到的这个大DNS黑名单列表了,先贴上来,后面看到了补)*

---

在adguardhome/conf下，有个yaml的配置文件。 (以上次文章的[docker安装](https://wzqvip.github.io/posts/docker-adguard-home/)为例)
这里提供一份配置好的可以用来复制。

**DNS部分：**

```
dns:
  bind_hosts:
    - 0.0.0.0
  port: 53
  anonymize_client_ip: false
  ratelimit: 20
  ratelimit_subnet_len_ipv4: 24
  ratelimit_subnet_len_ipv6: 56
  ratelimit_whitelist: []
  refuse_any: true
  upstream_dns:
    - tls://dns.alidns.com
    - https://dns.alidns.com/dns-query
    - tls://dns.pub
    - https://dns.pub/dns-query
    - tls://dns.google
    - https://dns.google/dns-query
    - tls://dns11.quad9.net
    - https://dns11.quad9.net/dns-query
    - https://dns10.quad9.net/dns-query
    - 1.1.1.1
    - 8.8.8.8
  upstream_dns_file: ""
  bootstrap_dns:
    - 119.29.29.29
    - 119.28.28.28
    - 223.5.5.5
    - 223.6.6.6
    - 1.1.1.1
    - 9.9.9.10
    - 149.112.112.10
    - 2620:fe::10
    - 2620:fe::fe:10
  fallback_dns: []
  upstream_mode: load_balance
  fastest_timeout: 1s
  allowed_clients: []
  disallowed_clients: []
  blocked_hosts:
    - version.bind
    - id.server
    - hostname.bind
  trusted_proxies:
    - 127.0.0.0/8
    - ::1/128
  cache_size: 4194304
  cache_ttl_min: 0
  cache_ttl_max: 0
  cache_optimistic: false
  bogus_nxdomain: []
  aaaa_disabled: false
  enable_dnssec: false
  edns_client_subnet:
    custom_ip: ""
    enabled: false
    use_custom: false
  max_goroutines: 300
  handle_ddr: true
  ipset: []
  ipset_file: ""
  bootstrap_prefer_ipv6: false
  upstream_timeout: 10s
  private_networks: []
  use_private_ptr_resolvers: true
  local_ptr_upstreams: []
  use_dns64: false
  dns64_prefixes: []
  serve_http3: false
  use_http3_upstreams: false
  serve_plain_dns: true
  hostsfile_enabled: true
```

**过滤器部分：**

```
filters:
  - enabled: true
    url: https://adguardteam.github.io/HostlistsRegistry/assets/filter_1.txt
    name: AdGuard DNS filter
    id: 1
  - enabled: false
    url: https://adguardteam.github.io/HostlistsRegistry/assets/filter_2.txt
    name: AdAway Default Blocklist
    id: 2
  - enabled: true
    url: https://adguardteam.github.io/HostlistsRegistry/assets/filter_21.txt
    name: 'CHN: anti-AD'
    id: 1724830708
  - enabled: true
    url: https://cdn.jsdelivr.net/gh/o0HalfLife0o/list@master/ad.txt
    name: halfLife
    id: 1724830709
  - enabled: true
    url: https://adguardteam.github.io/HostlistsRegistry/assets/filter_29.txt
    name: 'CHN: AdRules DNS List'
    id: 1724851309
  - enabled: true
    url: https://raw.githubusercontent.com/TG-Twilight/AWAvenue-Ads-Rule/main/AWAvenue-Ads-Rule.txt
    name: 秋风广告
    id: 1725765819
  - enabled: true
    url: https://www.i-dont-care-about-cookies.eu/abp/
    name: cookies
    id: 1725765820
  - enabled: true
    url: http://sub.adtchrome.com/adt-chinalist-easylist.txt
    name: 广告终结者
    id: 1725765821
  - enabled: true
    url: https://cdn.jsdelivr.net/gh/privacy-protection-tools/anti-AD@master/anti-ad-easylist.txt
    name: anti-AD命中率最高列表
    id: 1725765822
  - enabled: true
    url: https://raw.githubusercontent.com/privacy-protection-tools/anti-AD/master/anti-ad-easylist.txt
    name: Anti-AD
    id: 1725765823
whitelist_filters: []
user_rules:
  - '#短视频系列的'
  - 127.0.0.1 api.gifshow.com
  - 127.0.0.1 jsmov2.a.yximgs.com
  - 127.0.0.1 txmov2.a.yximgs.com
  - 127.0.0.1 alimov2.a.yximgs.com
  - 127.0.0.1 apissl.gifshow.com
  - 127.0.0.1 api.gifshow.com
  - 127.0.0.1 js2.a.yximgs.com
  - 127.0.0.1 tx2.a.yximgs.com
  - 127.0.0.1 bd.a.yximgs.com
  - 127.0.0.1 ali2.a.yximgs.com
  - 127.0.0.1 aliimg.a.yximgs.com
  - 127.0.0.1 qn.a.yximgs.com
  - 127.0.0.1 ipdispatch.live.xycdn.com
  - 127.0.0.1 ipdispatch.live.xycdn.com
  - 127.0.0.1 sdk.open.phone.igexin.com
  - 127.0.0.1 upload.gifshow.com
  - 127.0.0.1 api.ksapisrv.com
  - 127.0.0.1 sf2018-api.gifshow.com
  - 127.0.0.1 c-hzgt2.getui.com
  - 127.0.0.1 umc.danuoyi.alicdn.com
  - 127.0.0.1 sdk.conf.igexin.com
  - 127.0.0.1 qnmov.a.yximgs.com
  - 127.0.0.1 upload.ksapisrv.com
  - 127.0.0.1 sdkoptedge.chinanetcenter.com
  - 127.0.0.1 c-hzgt2.getui.com
  - 127.0.0.1 upload.ksapisrv.com
  - 127.0.0.1 static.yximgs.com
  - 127.0.0.1 apissl.ksapisrv.com
  - 127.0.0.1 ntp.nc.gifshow.com
  - 127.0.0.1 bd-livemate.pull.yximgs.com
  - 127.0.0.1 bd.pull.yximgs.com
  - '||pull.yximgs.com^'
  - '||yximgs.com^'
  - '||etoote.com^'
  - '||bcelive.com^'
  - '||gifshow.com^'
  - '||httpdns.c.cdnhwc2.com^'
  - '||jscmmov.a.etoote.com^'
  - '||bdcm.a.etoote.com^'
  - '||bdcmmov.a.etoote.com^'
  - '||alicmmov.a.etoote.com^'
  - '||api.e.kuaishou.com^'
  - '||js-rwk.pull.etoote.com^'
  - '||ulog.ksapisrv.com^'
  - '||ulog.gifshow.com^'
  - '||apinew.gifshow.com^'
  - '||umc.danuoyi.alicdn.com^'
  - '||apihn1.ksapisrv.com^'
  - '||infra-admin.corp.kuaishou.com^'
  - '||api.kwaizt.com^'
  - '||ksapisrv.com^'
  - '||corp.kuaishou.com^'
  - '||kwaizt.com^'
  - '||sdkoptedge.chinanetcenter.com^'
  - '||chinanetcenter.com^'
  - '||kuaishou.com^'
  - '||www.kuaishou.com^'
  - '||douyin.com^$important'
  - '||douyincdn.com^$important'
  - '||toutiao.com^$important'
  - '||snssdk.com^$important'
  - '||ixigua.com^$important'
  - '||amemv.com^$important'
  - '||bytedance.net^$important'
  - '||bdurl.net^$important'
  - '||douyincdn.com^$important'
  - '||yximgs.com^$important||douyin.com^$important'
  - '||douyincdn.com^$important'
  - '||toutiao.com^$important'
  - '||snssdk.com^$important'
  - '||ixigua.com^$important'
  - '||amemv.com^$important'
  - '||bytedance.net^$important'
  - '||bdurl.net^$important'
  - '||douyincdn.com^$important'
  - '||yximgs.com^$important'
  - ""

```
