---
title: "PVE为Ubuntu/Debian机器添加串行终端（可复制粘贴文字，非视频）"
date: 2025-07-27 21:52:58
categories:
  - "Homelab"
tags:
  - "PVE"
  - "HomeServer"
description: "PVE新建的机器默认是用的noVNC，复制粘贴都不好用，而且是视频比较难受。 修改/添加串口启动参数 /etc/default/grub GRUB\\ CMDLINE\\ LINUX\\ DEFAULT=\"quiet splash\" GRUB\\ …"
---

PVE新建的机器默认是用的noVNC，复制粘贴都不好用，而且是视频比较难受。

修改/添加串口启动参数

/etc/default/grub

*GRUB\_CMDLINE\_LINUX\_DEFAULT="quiet splash"
GRUB\_CMDLINE\_LINUX="console=tty0 console=ttyS0,115200n8"
#下面这行在下面有注释掉的版本，可以选择添加或者取消注释
GRUB\_TERMINAL=console*

更新启动参数

*sudo update-grub*

然后从PVE的机器硬件里面添加 Serial Port，数字和前面的ttyS\* 对应即可。

重启机器。

不出意外的话就可以了。 以及这种方法可以解决机器没有汉字字体导致的乱码/方块字。

[![](image.png)](image.png)
