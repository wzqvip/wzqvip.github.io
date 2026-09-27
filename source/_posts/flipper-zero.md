---
title: "Flipper Zero 自行编译固件"
date: 2025-01-25 17:09:00
categories:
  - "Computer Science"
  - "Misc"
tags:
  - "FlipperZero"
  - "Hack"
description: "这里以Momentum为例，去掉开机的“No Factory Keys Found\" 提示。 仅供个人与学习使用，请勿用于违法用途。"
index_img: "/posts/flipper-zero/3213646264.png"
---

这里以Momentum为例，去掉开机的“No Factory Keys Found" 提示。 仅供个人与学习使用，请勿用于违法用途。
![Warning](3213646264.png "Warning")

<!-- more -->

[Github官方链接](https://github.com/Next-Flip/Momentum-Firmware)

摘抄：

> To download the repository: $ git clone --recursive --jobs 8
> [https://github.com/Next-Flip/Momentum-Firmware.git](https://github.com/Next-Flip/Momentum-Firmware.git) $ cd
> Momentum-Firmware/
>
> To flash directly to the Flipper (Needs to be connected via USB,
> qFlipper closed) $ ./fbt flash\_usb\_full
>
> To compile a TGZ package $ ./fbt updater\_package
>
> To build and launch a single app: $ ./fbt launch APPSRC=your\_appid

这里用Github Desktop直接克隆就可以，注意网络，推荐（某猫猫头开Tun模式）。
windows上面使用fbt.cmd，可以一件操作。

[在线刷机工具](https://lab.flipper.net/)
这个要用TGZ包安装。 qFlipper桌面程序支持DFU或者TGZ。
默认情况下编译DFU包。

\[内容已删除\]

注释掉弹窗，刷机测试。
这里直接使用线刷功能 *./fbt.cmd flash\_usb\_full*
![2025-01-25T09:06:25.png](3970502984.png "2025-01-25T09:06:25.png")

然后开机测试，直接进入桌面，没有弹窗。
![2025-01-25T09:07:02.png](1253561856.png "2025-01-25T09:07:02.png")

如果使用正常方式更新，则仍然会弹窗，上游更新后需要继续修改后刷机才可以维持。

\[文件已删除\]
