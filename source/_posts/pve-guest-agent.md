---
title: "PVE虚拟机配置Guest Agent"
date: 2024-09-18 21:49:47
categories:
  - "Homelab"
description: "配置之后可以查看客户机通过DHCP获取到的ip地址，方便管理。 官方教程： Qemu-guest-agent"
index_img: "/posts/pve-guest-agent/2332534920.png"
---

配置之后可以查看客户机通过DHCP获取到的ip地址，方便管理。
![2024-09-18T13:46:55.png](2332534920.png "2024-09-18T13:46:55.png")
官方教程： [Qemu-guest-agent](https://pve.proxmox.com/wiki/Qemu-guest-agent)

<!-- more -->

## 介绍 - 什么是 qemu-guest-agent

qemu-guest-agent 是一个辅助守护进程，安装在客户机上，用于主机和客户机之间交换信息，并在客户机上执行命令。

在 Proxmox VE 中，qemu-guest-agent 主要用于三件事：

1.  要正确关闭客户机，而不是依赖 ACPI 命令或 Windows 策略
2.  在进行备份/快照时冻结客户文件系统（在 Windows
    上，使用卷影复制服务VSS）。如果客户代理已启用并正在运行，它会调用guest-fsfreeze-freeze和guest-fsfreeze-thaw来提高一致性。
3.  在客户机（VM）暂停后恢复的阶段（例如，快照之后），它会立即使用qemu-guest-agent（作为第一步）将其时间与虚拟机管理程序同步。

## 安装

## Linux

在 Linux 上，您只需安装 qemu-guest-agent，请参阅系统文档。

我们在此展示基于 Debian/Ubuntu 和 Redhat 的系统的命令：

***以下二选一***

在基于 Debian/Ubuntu 的系统上（使用 apt-get）运行：

```
apt-get install qemu-guest-agent
```

在基于 Redhat 的系统上（使用 yum）：

```
yum install qemu-guest-agent
```

***在部分情况下***

根据发行版的不同，客户代理可能不会在安装后自动启动。

```
systemctl start qemu-guest-agent
```

然后启用该服务自动启动（永久），如果没有自动启动，使用

```
systemctl enable qemu-guest-agent
```

（适用于大多数发行版）或重新启动客户机。

## Windows

挂载[virtio](https://pve.proxmox.com/wiki/Windows_VirtIO_Drivers)的iso
运行qemu-ga-x86\_64.msi（64 位）或qemu-ga-i386.msi（32 位）
