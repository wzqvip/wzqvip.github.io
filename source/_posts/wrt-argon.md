---
title: "Wrt路由器安装Argon主题"
date: 2024-09-05 17:41:00
categories:
  - "Network"
  - "Homelab"
tags:
  - "OpenWrt"
  - "Theme"
description: "Argon，一个全新的 OpenWrt 主题 默认主题如下： 比较简约，个人觉得还行，但是观感和效率不如Argon主题高。 Argon可以展开列并点击，这个也是最常见的第三方定制固件使用的主题。"
index_img: "/posts/wrt-argon/779481784.png"
---

![2024-09-05T09:15:30.png](4041068706.png "2024-09-05T09:15:30.png")
[Argon，一个全新的 OpenWrt 主题](https://github.com/jerrykuku/luci-theme-argon/blob/master/README_ZH.md)

默认主题如下：
![Bootstrap](779481784.png "Bootstrap")
比较简约，个人觉得还行，但是观感和效率不如Argon主题高。 Argon可以展开列并点击，这个也是最常见的第三方定制固件使用的主题。
![新的UI](1766905242.png "新的UI")

<!-- more -->

以ImmortalWrt为例，主要参考官方教程。
[在官方和 ImmortalWrt 上安装](https://github.com/jerrykuku/luci-theme-argon/blob/master/README_ZH.md#%E5%9C%A8%E5%AE%98%E6%96%B9%E5%92%8C-immortalwrt-%E4%B8%8A%E5%AE%89%E8%A3%85)
其实已经做好了全平台的ipk包，我们只需要下载对应的版本然后安装即可。

用MobaXterm（个人习惯）连接到路由器后台。

```
#先更新下
opkg update
#主题包
opkg install luci-compat
opkg install luci-lib-ipkg
wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v2.3.1/luci-theme-argon_2.3.1_all.ipk
opkg install luci-theme-argon*.ipk

#下面是config
wget --no-check-certificate https://github.com/jerrykuku/luci-app-argon-config/releases/download/v0.9/luci-app-argon-config_0.9_all.ipk
opkg install luci-app-argon-config*.ipk

```

不出意外的遇到了问题

```
root@ImmortalWrt-Home:~#     wget --no-check-certificate https://github.com/jerrykuku/luci-theme-argon/releases/download/v2.3.1
/luci-theme-argon_2.3.1_all.ipk
Downloading 'https://github.com/jerrykuku/luci-theme-argon/releases/download/v2.3.1/luci-theme-argon_2.3.1_all.ipk'
Connecting to :::443
Connection error: Connection failed
```

排查下发现是 *无法访问此网站检查 objects.githubusercontent.com 中是否有拼写错误。*
这个可能是网络问题，Github在部分地区访问不太好. 把 *githubusercontent.com* 添加到魔法列表中，然后浏览器就可以正常下载了。

---

> 路由器上面还是失败了。用浏览器下载之后传到home目录然后再操作了。
> 这里提供一个下载地址。2024/9/5更新。
> [luci-theme-argon\_2.3.1\_all.ipk](https://pan.tacoin.tech/f/Bytj/luci-theme-argon_2.3.1_all.ipk)
> [luci-app-argon-config\_0.9\_all.ipk](https://pan.tacoin.tech/f/vDF8/luci-app-argon-config_0.9__all.ipk)

如果不能访问前面的git可以用这个。不要重复操作。

```
wget --no-check-certificate https://pan.tacoin.tech/f/Bytj/luci-theme-argon_2.3.1_all.ipk
opkg install luci-theme-argon*.ipk

#下面是config
wget --no-check-certificate https://pan.tacoin.tech/f/vDF8/luci-app-argon-config_0.9__all.ipk
opkg install luci-app-argon-config*.ipk

```

---

然后刷新页面或者Ctrl+F5刷新，就可以看到新的UI已经启用了。
![新的UI](1766905242.png "新的UI")
如果没有启用的话去 系统/系统/语言和页面选择。 */cgi-bin/luci/admin/system/system*

完成。
