---
title: "Docker安装 AdGuard Home 广告拦截"
date: 2024-08-29 20:47:00
categories:
  - "Homelab"
tags:
  - "adguard"
  - "docker"
  - "ubuntu"
description: "家里配置Adguard Home（DNS) 广告拦截与访问控制。 路由器安装的话比较麻烦而且容易翻车，刚好有个Ubuntu服务器，于是就用Docker安装做DNS服务器，路由器DNS指向Adguard。"
index_img: "/img/covers/docker-adguard-home.svg"
---

家里配置Adguard Home（DNS) 广告拦截与访问控制。 路由器安装的话比较麻烦而且容易翻车，刚好有个Ubuntu服务器，于是就用Docker安装做DNS服务器，路由器DNS指向Adguard。

<!-- more -->

> 参考：
> [https://p3terx.com/archives/use-adguard-home-to-build-dns-to-prevent-pollution-and-remove-ads-1.html](https://p3terx.com/archives/use-adguard-home-to-build-dns-to-prevent-pollution-and-remove-ads-1.html)

如果只是本地局域网使用一般只需要映射 53 和 3000 端口：

```
docker run -d \
    --name adguardhome \
    -v $PWD/adguardhome/work:/opt/adguardhome/work \
    -v $PWD/adguardhome/conf:/opt/adguardhome/conf \
    -p 53:53/tcp \
    -p 53:53/udp \
    -p 3000:3000/tcp \
    adguard/adguardhome
    --restart unless-stopped \
    adguard/adguardhome:latest
```

最后我们添加了 --restart unless-stopped 选项会确保容器在 Docker 守护进程重启时自动重启，除非你手动停止了容器。以免系统重启后容器没有自动运行导致路由器无法上网。

这里我们作为旁路由/DNS服务器使用。只需要转发53端口负责DNS查询和3000端口负责web管理。

Ubuntu默认53端口被系统服务使用会报如下错误:

```
 Error starting userland proxy: listen tcp4 0.0.0.0:53: bind: address already in use.
```

参考解决方案

> [https://github.com/sameersbn/docker-bind/issues/65](https://github.com/sameersbn/docker-bind/issues/65)

```
sudo systemctl stop systemd-resolved
sudo systemctl disable systemd-resolved
```

备注1： 如果移除了adguard的DNS，要把这个恢复一下。第一行stop换成start就可以了。
备注2： 如果先停止了这个，会导致无法上网无法pull，建议先拉去镜像后再停止。

因为配置文件是映射到容器目录下的本机目录，所以如果重装容器配置文件依然在。

之后就是配置路由器了。
这里以openwrt为例，使用路由器DNS+DNS转发。在网络-DHCP/DNS下，添加DNS转发到设备ip。这样会使得路由器下设备DNS仍然是路由器，可以和passwall等共存。 缺点是会导致adguard后台看到的DNS查询全都来自路由器。
