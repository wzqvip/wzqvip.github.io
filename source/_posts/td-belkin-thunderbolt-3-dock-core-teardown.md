---
title: "[TD] Belkin Thunderbolt 3 Dock Core Teardown"
date: 2025-08-20 20:33:13
categories:
  - "Teardown"
description: "Belkin Thunderbolt 3 Dock Core With Thunderbolt 3 Cable - Usb C Hub - 7-In-1 Docking Station 60W charging."
---

# Belkin Thunderbolt 3 Dock Core With Thunderbolt 3 Cable - Usb C Hub - 7-In-1 Docking Station 60W charging.

[![](715-Ap-ZJbL._AC_SL1500_-300x247.jpg)](715-Ap-ZJbL._AC_SL1500_.jpg) [![](61Ug8hrCCwL._AC_SL1000_-259x300.jpg)](61Ug8hrCCwL._AC_SL1000_.jpg)

<!-- more -->

 One thing I love this dock is that it got an optional charging port, 60w though. Most docks only work with 20V power supply or does not support charging.

## PCB

[![](IMG_20250718_215002_compressed-e1755692570877-300x120.jpeg)](IMG_20250718_215002_compressed.jpeg) Bottom case, PCB&Heatsing, Top case. [![](IMG_20250718_215029_compressed-225x300.jpeg)](IMG_20250718_215029_compressed.jpeg) PCB front [![](IMG_20250718_215012_compressed-300x225.jpeg)](IMG_20250718_215012_compressed.jpeg) PCB back ALC4030 USB2.0 Audio Codec [![](IMG_20250718_215036_compressed-225x300.jpeg)](IMG_20250718_215036_compressed.jpeg) Removable USB-C cable Plug [![](IMG_20250718_215125_compressed-225x300.jpeg)](IMG_20250718_215125_compressed.jpeg) Intel JHL7440: Thunderbolt3 Controller Parade PS186: DisplayPort™ 1.4a to HDMI™ 2.0b Protocol Converter [![](IMG_20250718_215133_compressed-225x300.jpeg)](IMG_20250718_215133_compressed.jpeg) REALTEK RTS5420: USB3.2 Gen2x1 4-Port Hub Controller Infion CYPD5225: EZ-PD CCG5 provides a complete dual USB Type-C and *USB-Power Delivery* port control solution for PCs, notebook, and dock. [![](IMG_20250718_215152_compressed-225x300.jpeg)](IMG_20250718_215152_compressed.jpeg) REALTEK RTL8153B: 10/100/1000M ETHERNET CONTROLLER FOR USB 3.0 APPLICATIONS

## Notes:

This is one of the few Thunderbolt docks I’ve seen that offers optional Type-C power delivery. Unfortunately, the network adapter is not PCIe-to-Ethernet, but USB-based, which means its performance is slightly lower than PCIe. It may also lack Thunderbolt daisy-chain support in order to work without an independent power supply.

The other features are fairly standard. The unit I received has a slight coil whine issue, though I’m not sure whether it’s a design flaw or just an individual case.
