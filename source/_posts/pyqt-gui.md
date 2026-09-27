---
title: "使用PyQt制作GUI"
date: 2024-09-05 23:48:00
categories:
  - "Computer Science"
tags:
  - "Python"
  - "QT"
  - "GUI"
description: "EHS实验室项目。 使用PyQT制作GUI交互，其他使用嵌入式模块。"
---

![GUI效果](3550169507.png "GUI效果")
EHS实验室项目。 使用PyQT制作GUI交互，其他使用嵌入式模块。

<!-- more -->

先配置环境，个人喜欢用conda环境，创建一个名为py310的python3.10 。

```
conda create python=3.10 -n py310
```

记得激活

```
conda activate py310
```

安装PyQT

```
pip3 install PyQt5
#相关工具（可选）
pip install PyQt5-tools
```

打开设计：

```
pyqt5-tools designer
```

\-----省略-------
保存为.ui文件，然后生成python文件

A. 动态加载 .ui 文件（无需转换）

```
from PyQt5 import uic
from PyQt5.QtWidgets import QApplication, QMainWindow

class MyApp(QMainWindow):
    def __init__(self):
        super().__init__()
        uic.loadUi('yourfile.ui', self)  # 直接加载 .ui 文件
if __name__ == '__main__':
    app = QApplication([])
    window = MyApp()
    window.show()
    app.exec_()

```

B. 转换为py文件

```
pyuic5 -o output.py input.ui
```

然后运行.
![GUI](3550169507.png "GUI")

打包exe:
首先安装库

```
pip install pyinstaller
```

打包，如果有py以外的资源文件要手动添加。

```
#如果没有资源文件的话
pyinstaller --onefile --windowed main.py
#添加资源文件版本
pyinstaller --onefile --add-data "image.png;." main.py
```

然后就可以在dist下面找到main.exe了，现在是默认图标，要添加图标的话 *\--icon xx.ico*

后记：
打包文件的话路径会有问题，贴一个GPT的方案供参考：

```
# 获取当前运行文件的目录
basedir = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
pixmap_path = os.path.join(basedir, 'image.png')  # 使用相对路径
```
