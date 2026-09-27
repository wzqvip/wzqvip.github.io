---
title: "PVE 初始化设置"
date: 2024-11-08 19:38:00
categories:
  - "Server"
  - "Homelab"
tags:
  - "PVE"
  - "虚拟机"
description: "因为项目需要又要配置一台PVE虚拟机，目前版本8.2-2，记录一下基本的配置和直通。 平台是AMD 7950X就不做核显直通了。"
---

因为项目需要又要配置一台PVE虚拟机，目前版本8.2-2，记录一下基本的配置和直通。 平台是AMD 7950X就不做核显直通了。

<!-- more -->

个人习惯，删了local-lvm，全部放在local里面。 这样首页可以看到。

## 基本软件

```
apt update
apt -y install sudo git btop htop fish net-tools curl wget
```

## [PVE tools](https://github.com/ivanhao/pvetools) 懒人

```
export LC_ALL=en_US.UTF-8
 git clone https://github.com/ivanhao/pvetools.git
cd pvetools
./pvetools.sh
```

从这里设置apt换源，去除企业源，开启pci直通。 后面通显卡用。如果有个别sata硬盘也从这里通。
web界面显示版本不支持。一会用另一个的处理。

## 温度显示

```
bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/shidahuilang/pve@main/pve.sh)"
# 或者是github直连
bash -c "$(curl -fsSL https://raw.githubusercontent.com/shidahuilang/pve/main/pve.sh)"
```

PVE开启直通+CPU硬盘温度显示,风扇转速+一键开启换源，去订阅+CPU睿频模式选择

## 磁盘合并

注意，虚拟机默认在local-lvm上，这样操作会导致全部被删除！！！

1.备份所有虚拟机
2.删除所有虚拟机
3.重新分配磁盘空间

```
lvremove pve/data                 #删除local-lvm分区
lvextend -rl +100%FREE pve/root   #合并
resize2fs /dev/mapper/pve-root    #resize
```

4.记得给local里面勾选一下需要的内容，比如磁盘映像之类的。这里是允许存放的内容。
