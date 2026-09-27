---
title: "PVE虚拟机磁盘缓存策略对比"
date: 2024-10-04 20:39:00
categories:
  - "Server"
  - "Homelab"
tags:
  - "PVE"
  - "SSD"
  - "缓存策略"
description: "测试条件： 13900K 32G5600 双通道D5 三星970EvoPlus(pcie3.0x4,旧款). PVE8.2.2. Windows 11 专业版. 其实无缓的效果比想象的好，WriteBack是个人最喜欢的。 其他几个缓存策略…"
index_img: "/posts/PVE虚拟机磁盘缓存策略对比/2552383836.png"
---

测试条件： 13900K 32G5600 双通道D5 三星970EvoPlus(pcie3.0x4,旧款). PVE8.2.2. Windows 11 专业版.
其实无缓的效果比想象的好，WriteBack是个人最喜欢的。 其他几个缓存策略不知道为什么在一些情况下有负面效果。

<!-- more -->

Default/No Cache:
![2024-10-04T12:33:47.png](4178376315.png "2024-10-04T12:33:47.png")

DirectSync:
![2024-10-04T12:15:32.png](2101091558.png "2024-10-04T12:15:32.png")

Writethrough:
![2024-10-04T12:22:12.png](879378648.png "2024-10-04T12:22:12.png")

Writeback:
![2024-10-04T12:08:37.png](3184032593.png "2024-10-04T12:08:37.png")

Writeback(unsafe):
![2024-10-04T12:28:00.png](1510223898.png "2024-10-04T12:28:00.png")

[参考](https://www.guru3d.com/review/samsung-970-evo-plus-2tb-nvme-m-2-ssd-review/page-15/)原始速度：
![2024-10-04T12:36:31.png](2552383836.png "2024-10-04T12:36:31.png")

供横向对比。我这里使用的是WB，会使用RAM做读取缓存，省了自己在用primocache配置了。
