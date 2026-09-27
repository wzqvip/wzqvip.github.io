---
title: "PVE上传证书后无法访问web控制台"
date: 2024-09-23 15:04:00
categories:
  - "Homelab"
tags:
  - "证书"
  - "PVE"
  - "故障解决"
description: "呃，总之就是上传证书的时候可能选错了，然后web就一直提示 意外终止了连接 。SSH正常。 查询了一些文章或者重置证书无果。 curl发现报错是 SSL\\ ERROR\\ SYSCALL error 。 于是找到了论坛的解决方法。"
---

呃，总之就是上传证书的时候可能选错了，然后web就一直提示*意外终止了连接*。SSH正常。 查询了一些文章或者重置证书无果。 curl发现报错是*SSL\_ERROR\_SYSCALL error*。 于是找到了[论坛的解决方法](https://forum.proxmox.com/threads/ssl-error-with-pveproxy-ssl-certificates.68389/)。

<!-- more -->

## 问题

Chrome等浏览器提示 网页无法访问，xxx意外终止了连接。 使用其他电脑或者浏览器无痕模式结果一样。

curl结果：

```
root@PVE-Home ~# curl -k https://localhost:8006
curl: (35) OpenSSL SSL_connect: SSL_ERROR_SYSCALL in connection to localhost:8006
```

尝试了重启服务，强制生成证书替换都不工作。按照论他说法应该是证书和私钥不配对。

来自论坛链接：

> 这个帖子帮助我解决了同样的问题：
> [https://forum.proxmox.com/threads/ssl-certificate-upload-went-wrong.101087/](https://forum.proxmox.com/threads/ssl-certificate-upload-went-wrong.101087/)

## 解决方法：

```
cd /etc/pve/local ; rm pve*ssl.* ; pvecm updatecerts --force ; service pveproxy restart
```

和之前看到的其他方案相比，多了 `rm pve*ssl.*` 这一步。推测是光cert的话不会更新ssl仍然无法访问。

---

这篇文章内容很短。实际就一句代码。 详细的记录下就当作补充中文互联网缺少的内容吧。
似乎没有看到其他人遇到一样的问题。
