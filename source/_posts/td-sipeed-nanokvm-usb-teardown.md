---
title: "[TD] Sipeed NanoKVM-USB Teardown"
date: 2025-08-20 18:40:48
categories:
  - "Teardown"
tags:
  - "Teardown"
  - "KVM"
  - "Sipeed"
description: "NanoKVM-USB"
---

# NanoKVM-USB

<!-- more -->

[sipeed/NanoKVM-USB](https://github.com/sipeed/NanoKVM-USB)

Note: Not *Nano-KVM*. [https://github.com/sipeed/NanoKVM](https://github.com/sipeed/NanoKVM)

## Appearance

[![](2025-08-19-21.47.13-300x225.jpg)](2025-08-19-21.47.13.jpg) [![](2025-08-19-21.47.17-300x225.jpg)](2025-08-19-21.47.17.jpg) Aluminum Case.  Injection Molding caps. HDMI and USB-C on both sides. One switch and one USB2.0 Type-A on side.

## PCB

[![](2025-08-19-21.47.20-300x225.jpg)](2025-08-19-21.47.20.jpg) Top side.

<details>
<summary>Macrosilicon MS2131</summary>

 MS2131 is a USB 3.0 HD video and audio acquisition and processing chip, which integrates USB 3.0 device controller, data transceiver module, audio and video processing module. MS2131 can transmit the HD input audio and video signals to PC, smartphone and tablet for preview or acquisition through USB 3.0 interface, and can also display or expand the information on PC, smartphone and tablet to larger display devices through USB 3.0 interface. MS2131 supports HD loop out function, supports USB Host recording while playing audio and video through HD output. MS2131 supports 2 channels digital audio (I²S) input, and supports digital audio and HD audio mixing process. MS2131 supports 2 channels digital audio (I²S) output and SPDIF digital audio output. MS2131 output supports YUV422 and MJPEG modes, compatible with Windows, Android and macOS systems. [

</details>

](https://www.lcsc.com/datasheet/C42374501.pdf "Macrosilicon MS2131 Datasheet") Marcosilicon MS2131: USB3.0&2.0 Video capture, HDMI loop out. [https://www.lcsc.com/datasheet/C42374501.pdf](https://www.lcsc.com/datasheet/C42374501.pdf) Onsemi ESDR0524P, 3 pcs\*3 groups: ESD Protection Diode [https://www.onsemi.com/pdf/datasheet/esdr0524p-d.pdf](https://www.onsemi.com/pdf/datasheet/esdr0524p-d.pdf) [![](2025-08-19-22.25.27-225x300.jpg)](2025-08-19-22.25.27.jpg) 1P2xS 00389M: (?) Seems to be SPI Flash for MS2131. [![](Snipaste_2025-08-19_22-05-14-300x164.png)](Snipaste_2025-08-19_22-05-14.png) WCH CH340E: USB2.0 to Serial transceiver.   [![](2025-08-19-21.47.23-300x225.jpg)](2025-08-19-21.47.23.jpg) Bottom Side. WCH CH9329: Serial Port to HID Keyboard and Mouse Chip. [https://www.lcsc.com/datasheet/C2838834.pdf](https://www.lcsc.com/datasheet/C2838834.pdf)  CoreChips SL2.1S \*2: USB 2.0 HIGH SPEED 4-PORT HUB CONTROLLER. [https://www.lcsc.com/datasheet/C2684433.pdf](https://www.lcsc.com/datasheet/C2684433.pdf) VIA Labs VL162: USB Type-C Data Switch with CC Function for USB 3.1 Gen2. [https://www.lcsc.com/datasheet/C19270896.pdf](https://www.lcsc.com/datasheet/C19270896.pdf) [![](2025-08-19-22.25.29-225x300.jpg)](2025-08-19-22.25.29.jpg) [![](Snipaste_2025-08-19_22-26-55-300x250.png)](Snipaste_2025-08-19_22-26-55.png) Onsemi FSUSB42: Low-Power, Two-Port, High-Speed, USB2.0 (480Mbps) UART Switch. [https://www.onsemi.com/download/data-sheet/pdf/fsusb42-d.pdf](https://www.onsemi.com/download/data-sheet/pdf/fsusb42-d.pdf) [![](2025-08-19-22.25.33-225x300.jpg)](2025-08-19-22.25.33.jpg) MicroChip MIC5317: High Performance Single 150 mA MIC5317-2.5YD5, Marking Code 1J7.  *NOTE: MIC5317 is SOT-23-5, this is SOT23-6.* LDO [https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/MIC5317-High-Performance-Single-150mA-LDO-DS20006195B.pdf](https://ww1.microchip.com/downloads/aemDocuments/documents/OTH/ProductDocuments/DataSheets/MIC5317-High-Performance-Single-150mA-LDO-DS20006195B.pdf) [![](2025-08-19-22.25.31-225x300.jpg)](2025-08-19-22.25.31.jpg) LR5300 8WFj1: (?) Possible a low dropout regulator. Or ESD/CC.

## Summary

The NanoKVM-USB uses the **MS2131** chip for USB 3.0/2.0 video capture and loop-out. For keyboard and mouse control, it employs a **CH340E USB-to-UART** converter together with a **CH9329 UART-to-USB** chip.

On the **host side**, a USB-C 3.0 connection goes into a USB 3.0 Type-C hub, while the USB 2.0 path connects through a USB 2.0 hub before reaching the MS2131.
On the **device (controlled) side**, the USB-C port connects to a USB 2.0 hub. Both USB 2.0 hubs share a single USB 2.0 Type-A interface via a USB 2.0 switch.

Both USB-C ports support **C-to-C cables**, and it is suspected that the USB 3.0 hub is mainly included to ensure C-to-C cable compatibility.
