---
title: "关于我"
layout: about
comments: false
date: 2026-09-28 00:29:00
---

<!--
【草稿说明 —— 正式发布前把这段注释删掉】

这是新版「关于」页的自述，放在 source/_drafts/ 里，所以不会发布到网站。
front-matter 已经按「关于」页写好了，定稿后直接一条命令就能上去：

    git mv source/_drafts/about-v2.md source/about/index.md

另外 _config.fluid.yml 里的 about.intro 现在是「在读大学生 / 嵌入式开发工程师」，
和实际情况（已经读博了）对不上，建议一起改，文末我写了两条备选。

下面是我自己加的语气和细节（比如「不太安分」「被前端逼出来的」「不是我的主场」
「拆东西的瘾比装东西大」这类玩笑话），觉得不像你就直接删。
其余内容全部来自你的 GitHub 仓库、个人主页 README 和这个博客本身。
-->

**塔可 / taco / Tacoin / wzqvip / 蓝色大肥鱼** —— 叫哪个都行，反正都是同一个人。

现在在俄亥俄州立大学（The Ohio State University）读**计算机科学与工程博士**，
在一个做 AIoT 与机器学习系统的实验室里，研究怎么让大模型在边缘设备上跑得动。

一句话版本：**螺丝刀和示波器会用，CUDA 和 PyTorch 也写，从芯片手册到推理框架都摸过一遍。**

## 现在在做什么

我关心的其实一直是同一件事：**把一个模型塞进一块算力可怜的板子里，还要让它好用。**

- **给视频理解模型做调度。** 不同的问题需要的帧数差很多——「画面里有没有车」一帧就够，
  「他为什么打开礼物之后哭了」八帧起步。与其给每个请求都发固定帧数，
  不如把它们丢进一个共享的算力池，按边际收益分配。这是我现在的课题原型，
  仓库叫 [FrameBroker](https://github.com/wzqvip/M-LLM-Global-Scheduler)。
- **让边缘盒子真的能用。** NVIDIA 官方源里带 CUDA 的 PyTorch 预编译版本少得可怜，
  于是我从源码编了一套脚本，覆盖 Jetson Orin（Ampere）到 Thor（Blackwell）。
  [这个仓库](https://github.com/wzqvip/jetson-pytorch-builder)莫名其妙攒到 37 个 star，
  说明被同一件事坑过的人不止我一个。
- **顺带做量化和 VLA**（视觉-语言-动作模型）在边缘设备上的评测。

再往前，我做过脉冲神经网络在专用硬件上的验证，也做过医学影像的深度学习。
看起来跳来跳去，其实是同一条线：**能不能跑得动，跑得值不值。**

## 怎么走到这儿的

| 阶段 | 在哪 | 干过什么 |
| --- | --- | --- |
| 本科 | **上海科技大学**，计算机科学与技术 | 当无人机社副社长，自己焊过四轴和固定翼 |
| 社团 | 上科大 **GeekPie** 极客社团 | 写过[招新题解](https://wzqvip.github.io/posts/geekpie-2024-a-e/)，接触 CTF |
| 工作 | **ForePhysics**，嵌入式 / IT 工程师 | 做交互装置里的 IoT：画 PCB、写固件、抠功耗、跟产线 |
| 现在 | **俄亥俄州立大学** | ECE 硕士 → CS&E 博士，从「修板子」慢慢转向「修模型」 |

在上科大我还办了一个叫 **TechRetro Club** 的社团（复古科技与硬件改造），
当了第一届社长。一群人对着一堆二十年前的机器较劲，那段挺开心的。

## 会点什么

老版本的科技树是一棵没有重点的树，从 Python 一路挂到木工，看起来什么都沾一点。
新版按「现在靠这个吃饭 / 什么算熟 / 什么只是玩过」重排了一下：

### 🍚 靠这个吃饭

**Python**（研究、脚本、数据处理）· **C / C++**（固件、驱动、性能敏感的地方）·
**Linux**（Ubuntu / Debian，从内核参数到 systemd 一路踩过来）·
**PyTorch / CUDA**（训练、量化到部署）· **Docker**（什么服务都先塞进容器再说）

### 🔧 算熟

- **嵌入式**：ESP32 / ESP8266 / nRF52 / STM32，Arduino 生态，I2C / SPI / UART / CAN，墨水屏与 LCD
- **硬件**：画 PCB、焊板子（含 SMT 返修）、整机装机与超频调试、显卡拆解保养、手机换电池换屏
- **系统与网络**：Proxmox VE 虚拟化、OpenWrt / ImmortalWrt、VLAN 与管理型交换机、
  WireGuard 组网、群晖与 TrueNAS，以及一台常年不太安分的家庭服务器
- **工具链**：Git、Conda、Shell、MATLAB、LaTeX、SolidWorks / Fusion 360

### 🎲 玩过、够用

- **JavaScript / TypeScript**：主要是被前端逼出来的
- **无人机**：DJI 航拍与 FPV，也自己搭过多旋翼
- **Flipper Zero**：自己编译固件，接 CC1101 Sub-GHz、NRF24、ESP32 Marauder，还画过扩展板
- **安全**：拆过自己的智能门铃摄像头做逆向，也给国产 NAS 系统 FnOS 找过一个提权问题并写了完整分析
  （边界我很清楚：**只拆自己的、只研究自己的**）
- **3D 打印**：装配、调平、堵头、修
- **设计**：Photoshop、Premiere，以及 PCB 打样与贴片
- **木工**：有国家三级证书 —— 真的，虽然现在没什么机会用

### 🙃 短板

前端能改，但显然不是我的主场。

## 最近在折腾的

| 项目 | 一句话 |
| --- | --- |
| [FrameBroker](https://github.com/wzqvip/M-LLM-Global-Scheduler) | 批量视频理解的全局算力调度（研究预览） |
| [jetson-pytorch-builder](https://github.com/wzqvip/jetson-pytorch-builder) | 给 Jetson Orin / Thor 从源码编带 CUDA 的 PyTorch（37★） |
| [Feiniu-ollama-update](https://github.com/wzqvip/Feiniu-ollama-update) | 一键更新飞牛 NAS 上 Ollama 的小脚本（42★，已归档） |
| [esp32-csi-sense](https://github.com/wzqvip/esp32-csi-sense) | 两块 ESP32-C3 抓 Wi-Fi CSI，试着隔空识别键盘敲击 |
| [esp32-s3-geek-debug-console-tool](https://github.com/wzqvip/esp32-s3-geek-debug-console-tool) | 插上就用的无线调试棒：USB 串口 + USB 网卡 + 网页终端（和 AI 结对写的） |
| [classpipe](https://github.com/wzqvip/classpipe) | 把 Canvas 课表、课堂录音和课件凑成一个本地课堂助手 |
| [NeoMeter](https://github.com/wzqvip/NeoMeter) | 拿 ESP32-C3 驱动机械指针表头，实时显示 CPU / 显存占用 |

完整清单在 [GitHub](https://github.com/wzqvip?tab=repositories)，六十几个仓库，什么奇怪东西都有。

## 这个博客写什么

主要是**给自己留的维修记录**。装过的东西半年后一定会忘，所以趁还记得赶紧写下来：

- **家庭实验室**：PVE、OpenWrt、群晖、WireGuard、AdGuard…… 踩的坑比成功多，
  都塞在[「Homelab」分类](https://wzqvip.github.io/categories/Homelab/)里
- **拆解**：买回来先拧开看看里面是什么，Thunderbolt 扩展坞、U 盘、KVM……
  拆完拍完照，才想起来本来是买来用的，都在[「拆解」板块](https://wzqvip.github.io/teardown/)
- **充电测试**：给手边的设备量充电曲线，纯粹因为觉得好看
- **留学杂记**：F1 签证、信用卡、学历认证这些没人提前告诉你的事

写得越来越随便，但都是真踩过的。

## 一些没什么用的事实

- 拆东西的瘾比装东西的瘾大，买回来的第一件事往往是拧开看里面
- 曾经拥有 <del>Framework Laptop 13</del> 和 <del>LTT 螺丝刀</del>
- 喜欢机械指针多过数码显示，所以才会去用 ESP32 驱动一块老式电流表
- 博客里的自画像是一条吃白饭的蓝色大肥鱼

---

[GitHub](https://github.com/wzqvip) · 邮箱：[wang.20306@osu.edu](mailto:wang.20306@osu.edu)

<!--
【关于 about.intro 的建议】
现在 _config.fluid.yml 里是「在读大学生 / 嵌入式开发工程师」，建议二选一：

  intro: "俄亥俄州立大学 CS&E 博士生 / 边缘 AI 与嵌入式"

  intro: "在读博士 / 拆解爱好者 / 前嵌入式工程师"
-->
