---
title: "[TD]  OWC Thunderbolt4 Hub Teardown"
date: 2025-08-20 20:15:16
categories:
  - "Teardown"
description: "OWC Thunderbolt Hub with Three Thunderbolt 4 Ports and One USB Port"
index_img: "/posts/td-owc-thunderbolt4-hub-teardown/image-1-300x182.webp"
---

# OWC Thunderbolt Hub with Three Thunderbolt 4 Ports and One USB Port

[![](41eHHDrgqQL._AC_SL1080_-300x134.jpg)](41eHHDrgqQL._AC_SL1080_.jpg)[![](618IBnEWL2L._AC_SL1080_-300x195.jpg)](618IBnEWL2L._AC_SL1080_.jpg)

<!-- more -->

## PCB

[![](20240820_042819_compressed-300x225.jpeg)](20240820_042819_compressed.jpeg) PCB1-Front [![](20240820_042502_compressed-300x225.jpeg)](20240820_042502_compressed.jpeg) PCB1-Back [![](20240820_042722_compressed-300x225.jpeg)](20240820_042722_compressed.jpeg) PCB2-Front

## Chips

[![](20240820_042828_compressed-225x300.jpeg)](20240820_042828_compressed.jpeg)

### Intel® JHL8440 Thunderbolt™ 4 Controller

![](https://edit.wpgdadawant.com/uploads/news_file/blog/2023/9966/tinymce/6.jpg)     [![](20240820_042511_compressed-300x225.jpeg)](20240820_042511_compressed.jpeg) CYPD5235: USB Type-C Port Controller     [![](20240820_042523_compressed-300x225.jpeg)](20240820_042523_compressed.jpeg) Parade FL5801: 5-Port USB2 Port Expander for TBT4 Docks Note: JHL8440 only extends THUNDERBOLT at all ports. Add this to support USB2.0 feature. infineon CY7C6521: USB-Serial Dual Channel (UART/I2C/SPI) Bridge with CAPSENSE™ and BCD   [![](20240820_042742_compressed-225x300.jpeg)](20240820_042742_compressed.jpeg) TI MSP430FR2110: 16 MHz MCU with 2KB FRAM, 1KB SRAM, comparator, 10-bit ADC, UART/SPI, timer. Note: Interact with JHL8440, BLUE LED for CONNECTED, WHITE for STANDBY.

## Notes

Intel didn't make full pcie3.0x4 thunderbolt 4 controllers. So there's only TBT3/USB4/TBT5 SSD/GPU docks:

-   TBT3  ~3100MBps
-   USB4 ~3500MBps
-   TBT5 ~6400MBps

For Thunderbolt 4 Dock with SSD/PCIE support, needs to be JHL8440 TBT HUB + JHL 7440 TBT3 controller. Expensive&sucks. [![](image-1-300x182.webp)](image-1.webp) JHL7440 TBT3 controller: TBT daisy chain, USB3 10Gbps, PCIE3.0x4, 4xHBR2 DP
