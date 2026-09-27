---
title: "Intel BE200网卡连接WiFi-7."
date: 2024-12-16 19:23:14
categories:
  - ["Network"]
  - ["Misc"]
tags:
  - "Intel"
  - "WiFi-7"
  - "Drivers"
description: "出于未知原因，intel新的驱动阉割了6Ghz与WIFI7支持（？） 删除注册表版本记录并降级到22.30版本即可。"
---

出于未知原因，intel新的驱动阉割了6Ghz与WIFI7支持（？） 删除注册表版本记录并降级到22.30版本即可。

<!-- more -->

首先查看当前驱动版本，可以去网络属性或者设备管理器查看。
![2024-12-06T08:35:26.png](1130589060.png "2024-12-06T08:35:26.png")

然后去注册表的

```
计算机\HKEY_LOCAL_MACHINE\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall
```

使用搜索查找当前版本号，并删除当前条目{xxx-xxx-x......}

然后下载旧版本驱动 因为intel会删除旧的，所以这里做一下镜像。
[WiFi-23.30.0-Driver64-Win10-Win11.zip](3383057170.zip)

之后安装之后连接即可。 不行的话删了重启之类的，也可能是其他地方出了问题。
