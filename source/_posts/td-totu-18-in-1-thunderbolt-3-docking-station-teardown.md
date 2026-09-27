---
title: "[TD] TOTU 18-in-1 Thunderbolt 3 Docking Station Teardown"
date: 2025-08-21 08:12:41
categories:
  - "Teardown"
description: "TOTU 18-in-1 Thunderbolt 3 USB C Docking Station with 8K DP, 1 Gbps Ethernet, USB-A 10Gbps, USB-C 3.2, SD/TF, Audio, Opt…"
---

# TOTU 18-in-1 Thunderbolt 3 USB C Docking Station with 8K DP, 1 Gbps Ethernet, USB-A 10Gbps, USB-C 3.2, SD/TF, Audio, Optical Out

[![](71SYaqscfpL._AC_SL1500_-300x283.jpg)](71SYaqscfpL._AC_SL1500_.jpg)

<!-- more -->

## PCB

[![](20241016_081953_compressed-225x300.jpeg)](20241016_081953_compressed.jpeg)[![](20241016_082004_compressed-225x300.jpeg)](20241016_082004_compressed.jpeg) Main PCB [![](20241016_082202_compressed-225x300.jpeg)](20241016_082202_compressed.jpeg) [![](20241016_082208_compressed-225x300.jpeg)](20241016_082208_compressed.jpeg)[![Thunderbolt 3 Module 1](https://www.acp-tech.com/uploads/images/20231228/78de117472280fdc09d6ce410eb171bd.jpg)](20241016_082208_compressed.jpeg) Thunderbolt3 Module: JHL7440. It's a single M.2 slot version, doesn't have PCIE3.0 x4.

<details>
<summary>Another version has dual M.2 slot (NOT IN THIS PRODUCT)</summary>

   DEMISION [![](912b10d62e4cf31d98a16c802281e472-1-1024x548.jpeg)](912b10d62e4cf31d98a16c802281e472-1.jpeg)   [![](7e341e346dd280d7ac122667518ed4e5-300x300.jpg)](7e341e346dd280d7ac122667518ed4e5.jpg)[![](9513fdcaa1bf8f6b1c4dd5ac1c54aeac.jpg)](9513fdcaa1bf8f6b1c4dd5ac1c54aeac.jpg) Dual M.2 verision. Usually seen at eGPU dock.

</details>

 [![](20241016_082342_compressed-225x300.jpeg)](20241016_082342_compressed.jpeg) Terminus FE8.1: USB2.0 High Speed 4 port hub controller [![](20241016_082424_compressed-225x300.jpeg)](20241016_082424_compressed.jpeg) Realtek RTL8153B: 10/100/1000M ETHERNET CONTROLLER FOR USB 3.0 APPLICATIONS TF TFS5009: Network transformer, semiconductor component optimized for high-speed and low-voltage operations. [![](20241016_082444_compressed-225x300.jpeg)](20241016_082444_compressed.jpeg) Solid State System  3S1530A: 16Bit, 48kHz Audio DAC. single chip TYPE-C USB audio controller with on chip oscillator. [https://www.3system.com.tw/upload//product/Solid\_State\_System\_Audio\_1530\_2023\_E02.pdf](https://www.3system.com.tw/upload//product/Solid_State_System_Audio_1530_2023_E02.pdf) [![](20241016_082451_compressed-225x300.jpeg)](20241016_082451_compressed.jpeg) AVD WA8353: USB to SD/TF dual card reader. \[MISSING DATASHEET\] Via Labs VL162: Data Switch with CC Function for USB 3.1 Gen2 (10Gbps) [![](20241016_082501_compressed-225x300.jpeg)](20241016_082501_compressed.jpeg) FMD 24C08A: Two-Wire Serial EEPROM 8K (8-bit wide) .

## Notes

Bought this for only CNY40 on Xianyu. Good bargan. ONLY WORK WITH EXTERNAL 20V POWER SUPPLY. Perfect mate for Mac Mini M4. DP/C-daisychain: 4K144/2K240 tested OK. I really love it marks all the transmission speed next to the port. USB2.0, USB3.0 5G, USB3.0 10G. Still, 65W PD charging.
