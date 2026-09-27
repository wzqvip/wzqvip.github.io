---
title: "网页HTTPS/SSL证书获取"
date: 2024-09-03 17:54:00
categories:
  - "Server"
tags:
  - "HTTPS"
  - "证书"
description: "Cloudflare可以一键获取15年的服务器对CF证书，但是开启CF代理在\\ \\ 网速会比较慢。CF又不提供阿里/腾讯那样的证书，要自行从LetsEncrypt获取。 我们用手动模式，设置DNS，然后获取证书上传到服务器。 文档 http…"
index_img: "/img/covers/https-ssl.svg"
---

Cloudflare可以一键获取15年的服务器对CF证书，但是开启CF代理在\*\*网速会比较慢。CF又不提供阿里/腾讯那样的证书，要自行从LetsEncrypt获取。 我们用手动模式，设置DNS，然后获取证书上传到服务器。
文档

> [https://eff-certbot.readthedocs.io/en/latest/using.html#manual](https://eff-certbot.readthedocs.io/en/latest/using.html#manual)

<!-- more -->

> [https://certbot-dns-cloudflare.readthedocs.io/en/stable/](https://certbot-dns-cloudflare.readthedocs.io/en/stable/)
> 这里有一个使用CloudFlare-API自动完成域名DNS验证的插件，我们利用下。

我们先下载CertBot。 [2.1.1 x64 windows](https://github.com/certbot/certbot/releases/download/v2.1.1/certbot-beta-installer-win_amd64_signed.exe)
2.1是最后一个windows支持，2.10之后就不支持windows了。
*备注： 最后使用Ubuntu来完成了，windows端没有做，具体可以参考官方文档。 后续应该会停止对windows的支持。*

---

花开两朵，各表一枝

这里咨询了GPT，他说用wsl或者ubuntu。 我们用ubuntu为例
家庭宽带没有80端口， 我们用添加DNS解析的方式，如前文提到的DNS搭配cf插件。

打开WSL中的Ubuntu终端并更新包列表：

```
sudo apt-get update
sudo apt-get install certbot
```

安装Certbot插件以使用Cloudflare API：

```
sudo apt-get install python3-certbot-dns-cloudflare
```

老规矩，先拿到区域API： 这里我也是选择了全部的子域名，详细可以去看
[之前的博客-获取APIkey](https://wzqvip.github.io/posts/openwrt-cloudflare-ddns/)
然后创建配置文件。以下按照GPT推荐的目录：

```
sudo nano /etc/letsencrypt/cloudflare.ini
```

内容为：
***dns\_cloudflare\_api\_token = YOUR\_TOKEN\_HERE***

设置权限

```
sudo chmod 600 /etc/letsencrypt/cloudflare.ini
```

运行

```
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d 【域名填写在这里】 --preferred-challenges dns-01
```

***如果是群晖的话，要选择RSA加密证书。 多个域名的话就用多个-d参数即可。***

```
sudo certbot certonly --dns-cloudflare --dns-cloudflare-credentials /etc/letsencrypt/cloudflare.ini -d 域名1 -d 域名2 --preferred-challenges dns-01 --key-type rsa

```

成功：

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/域名.tacoin.site/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/域名.tacoin.site/privkey.pem
This certificate expires on 2024-12-02.
These files will be updated when the certificate renews.
Certbot has set up a scheduled task to automatically renew this certificate in the background.
```

第一个pem是证书，第二个是私钥，可以重命名为.key。 对于群晖的话就是简单的上传即可。
看日志的话这个脚本还自动设置了后台计划来定期更新这个位置的证书。 后续再补充自动更新之类的。
