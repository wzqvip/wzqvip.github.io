---
title: "Flipper Zero 使用AVR Flasher刷写Arduino固件"
date: 2025-03-09 19:49:00
updated: 2025-07-25 23:13:21
categories:
  - "Homelab"
description: "使用 Flipper Zero AVR Flasher 读取/刷写 AVR 系 Arduino 产品固件 本教程介绍如何使用 Flipper Zero 作为 AVR 编程器 ，在离线或 PC 端 读取（Dump） 和 刷写（Flash） A…"
index_img: "/posts/flipper-zero-avr-flasher-arduino/1898637020.png"
---

### **使用 Flipper Zero AVR Flasher 读取/刷写 AVR 系 Arduino 产品固件**

本教程介绍如何使用 **Flipper Zero** 作为 **AVR 编程器**，在离线或 PC 端 **读取（Dump）** 和 **刷写（Flash）** Arduino 设备的 **ATmega16U2（USB-串口桥）** 或 **主控 MCU（如 ATmega328P/ATmega2560）** 的固件。

<!-- more -->

## **准备工作**

### **Flipper Zero 端**

1.  进入 **AVR Flasher** 应用。
2.  参考 **Wiring 选项**，按提示的 **线序** 连接到 Arduino 目标芯片：

    -   **VCC → 目标板 VCC**
    -   **GND → 目标板 GND**
    -   **MOSI → 目标板 MOSI**
    -   **MISO → 目标板 MISO**
    -   **SCK → 目标板 SCK**
    -   **RST → 目标板 RESET**
3.  连接完成后，Flipper Zero 作为编程器即可工作。

![Arduino Uno Pins](1898637020.png "Arduino Uno Pins")

## ![Flipper Zero as AVR Flasher](1154936172.png "Flipper Zero as AVR Flasher")

## **PC 端操作**

要在 **PC 端** 进行读取（Dump）或刷写（Flash），你需要安装 `avrdude`。

### **下载 AVRDUDE**

-   Windows 用户：[AVRDUDE 官方 GitHub](https://github.com/avrdudes/avrdude/)
-   Linux 用户可以直接安装：

    ```
    sudo apt install avrdude
    ```

安装完成后，打开命令行（Windows 终端 / PowerShell / CMD 或 Linux 终端）。

---

## **读取（Dump）固件**

使用 `avrdude` 读取目标芯片的 Flash 并保存固件：

```
avrdude -p <芯片型号> -c stk500v1 -P COM<端口号> -U flash:r:<文件名.hex>:i
```

示例（读取 ATmega16U2 固件）：

```
avrdude -p m16u2 -c stk500v1 -P COM14 -U flash:r:ArduinoMega2560_16u2.hex:i
```

### **参数说明**

-   `-p <芯片型号>`：目标芯片类型（如 `m16u2`、`m328p`）。
-   `-c stk500v1`：指定编程器（Flipper Zero 作为 AVR ISP）。
-   `-P COM<端口号>`：Flipper Zero 在 PC 上映射的 **COM 端口**（Windows 设备管理器可查看）。
-   `-U flash:r:<文件名.hex>:i`：从 Flash 读取固件，并以 Intel HEX 格式保存。

---

## **刷写（Flash）固件**

使用 `avrdude` 向目标芯片写入新的固件：

```
avrdude -p <芯片型号> -c stk500v1 -P COM<端口号> -U flash:w:<固件文件.hex>:i
```

示例（刷写 ATmega16U2 固件）：

```
avrdude -p m16u2 -c stk500v1 -P COM14 -U flash:w:ArduinoMega2560_16u2.hex:i
```

### **注意**

-   **写入前请确保固件与目标芯片匹配**，错误刷写可能导致芯片变砖！
-   若 Flash 被锁定（Lock Bits 设置），可能需要手动擦除 (`-e`) 并解锁。
-   若刷写失败，可尝试先执行擦除：

    ```
    avrdude -p m16u2 -c stk500v1 -P COM14 -e
    ```

---

## **读取 EEPROM（如 Bootloader 或配置）**

如果你想备份 EEPROM 数据：

```
avrdude -p <芯片型号> -c stk500v1 -P COM<端口号> -U eeprom:r:<文件名.hex>:i
```

示例：

```
avrdude -p m16u2 -c stk500v1 -P COM14 -U eeprom:r:backup_eeprom.hex:i
```

---

## **检测 Flipper Zero 是否正确连接**

你可以运行：

```
avrdude -p m16u2 -c stk500v1 -P COM14 -v
```

如果连接正确，你会看到芯片信息和编程器状态。

---

附件：

UNO R3 CN:
[ArduinoUnoR3CN\_16u2.hex](1206904844.hex)
[ArduinoUnoR3CN\_328p.hex](4282550408.hex)

Mega 2560 CN:
[ArduinoMega2560CN\_16u2.hex](2915745610.hex)
[ArduinoMega2560CN\_2560.hex](1278622668.hex)

Mega 2560 Original:
[ArduinoMega2560\_16u2.hex](3207481321.hex)
[ArduinoMega2560\_2560.hex](97574060.hex)
