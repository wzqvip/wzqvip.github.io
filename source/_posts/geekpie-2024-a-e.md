---
title: "GeekPie 2024 招新题目题解 (A-E)"
date: 2024-11-06 00:00:00
categories:
  - "Computer Science"
description: "已经是老成员了，所以一边看看一边写写题解。A-E题都是CTF方向的，花了点时间做了, F题目有些猜不到, G题不在知识库。"
index_img: "/posts/geekpie-2024-a-e/3469230795.png"
---

已经是老成员了，所以一边看看一边写写题解。A-E题都是CTF方向的，花了点时间做了, F题目有些猜不到, G题不在知识库。

<!-- more -->

## A. [Reveal the Past](https://hydro.ac/d/G3eKP1E_2024/p/P1001?tid=670d369c130a4aed4d83dbf7)

跳转到项目仓库 [https://github.com/ShanghaitechGeekPie/HelloGeekPie-2024/blob/main/README.md](https://github.com/ShanghaitechGeekPie/HelloGeekPie-2024/blob/main/README.md)

发现有四个分支，随机翻阅发现一些话与时光机相关。 Git is all what you need. 翻阅[commit历史](https://github.com/ShanghaitechGeekPie/HelloGeekPie-2024/commit/be21c31d6180844d9aaae2bc14068d2fc6e0227a#diff-21e2ae0fb85fde7bb246ed90194f601e041b3c8ac6e937b1878bd8e0e796a098R1)可以找到

```
flag{WW91IHNob3VsZCBjaGVja291dCBodHRwczovL29oc2hpdGdpdC5jb20vemg=}
```

## B. [Say My Name](https://hydro.ac/d/G3eKP1E_2024/p/P1002?tid=670d369c130a4aed4d83dbf7)

开局两张图，一个是 BrokenCode.png， 另一个是 IsThisPhotoFromWikipedia.jpg

*[布莱斯](https://zh.wikipedia.org/zh-cn/%E5%B8%83%E8%8E%B1%E6%96%AF%C2%B7%E5%BE%B7%C2%B7%E7%BB%B4%E5%90%89%E5%B0%BC%E4%BA%9A "WikiPedia")* · *德* · *维吉尼亚* （法语：Blaise De Vigenère，1523年8月5日—1596年），法国外交官、密码学家、炼金术士。*维吉尼亚*密码以其名字命名，但实际上并非他的发明。

可以知道

-   要补全二维码
-   要~炼铜~考虑[密码学](https://zh.wikipedia.org/zh-cn/%E7%BB%B4%E5%90%89%E5%B0%BC%E4%BA%9A%E5%AF%86%E7%A0%81 "维吉尼亚密码")/CTF有关内容

    -   既然提示说了名字那就直接考虑维吉尼亚密码。
    -   文件名明示了去wiki看看

![1729098133807.png](3801445331.png "1729098133807.png")

### QR Code

使用 ![1729098050311.png](677095672.png "1729098050311.png") 补全二维码
![1729098045958.png](3777544877.png "1729098045958.png")
可以解析到 [https://gist.github.com/AstatineAi/9716ad25738ac0783783316c3c8d5b5c](https://gist.github.com/AstatineAi/9716ad25738ac0783783316c3c8d5b5c)

拿到 [**contest\_key**](https://gist.github.com/AstatineAi/9716ad25738ac0783783316c3c8d5b5c#file-contest_key)

```
（原文此处内联了一段私钥；为避免被 GitHub 推送保护拦截，本站不再内联，请点上方链接查看原文）
```

[**some-key.txt**](https://gist.github.com/AstatineAi/9716ad25738ac0783783316c3c8d5b5c#file-some-key-txt)

```
flag{thisisalsoakeyinaway}
```

### Dig deeper

提交这个key之后得到

```
points 75 Almost There. The image is quite strange...
```

维吉尼亚密码需要密文和密钥

根据图片名信息我们去wiki看看[原图](https://zh.wikipedia.org/wiki/File:Vigenere.jpg)。 原图是428\*553, 213KB. 下载的文件尺寸一样但是有250kb.

我们手动删除前面的内容（要用Hex 编辑器），然后分析文件格式，得到

| 100.0% | [ZIP](https://www.aconvert.com/format/zip/) | ZIP compressed archive |
| --- | --- | --- |

然后我们可以得到 [testlib.h](https://github.com/MikeMirzayanov/testlib "不是这个")。
[testlib.h](3286860937.h) 搜索flag可以找到一段人为添加的代码

```
/*
flag

Yes, this is not the original content of testlib.h.
The following content is really hard to understand.
If you can find out what the sentences in flag{} mean, submit the
final flag to Online Judge.

flag{Zpdwv lhp wlicxcvpe ws smamjmv fzjhh sr rpr pqbjbj egzcs zx Duxgfme ajd Utabeifn zx o povqwaah Gmw xcsymabmoqee uqgh shgml jwijd bmoqeeocnqqa mnaaalw ttes wsxfwht axrxuaawf wsg tryq rpr haieaaa gn vigabe ktybuiw dgopvw ilhlepik hgdvna anahaai dogwg uc hcielu wgmo aguw eiuspdmmvf fkr pxhagvk uycbogr zcg temc pptd bwlw.}
*/
```

提交后拿到85分。

```
points 85 So close, where is the key?
```

突然想起来 `thisisalsoakeyinaway`

解密后得到

```
flag{Given the existence as uttered forth in the public works of Puncher and Wattmann of a personal God quaquaquaqua with white beard quaquaquaqua outside time without extension who from the heights of divine apathia divine athambia divine aphasia loves us dearly with some exceptions for reasons unknown but time will tell.}"
```

## C. [Dim and Dark](https://hydro.ac/d/G3eKP1E_2024/p/P1003?tid=670d369c130a4aed4d83dbf7)

*补充提示* Hex **→** Dec

flag{ ColorIsTheKey.png }

四个颜色再PS里面打开，Hex分别是

```
#0a0a0a
#141414
#838383
#707070
```

转换成十进制

```
10.20.131.112
```

校内网段刚好是10.0.0.0/8，结合上一题没有用到的SSH可以联想到是IP地址。

> 如果直接把1020131112作为flag提交上去会提示你 shanghaitech netinfo.

```
flag{10.20.131.112}
```

## D. [Random String Generator](https://hydro.ac/d/G3eKP1E_2024/p/P1004?tid=670d369c130a4aed4d83dbf7)

> Use what you've got in problem B and C.
>
> As 'user,' pass through port No.52436, and the world of answers will open its doors to you.

### SSH Server

这里直接 `ssh user@10.20.131.112 -p 52436 -i "/path_to_key/priv_key"`

连接好之后发现这是个vim窗口。 ~这题无解，只能重装系统了~

:q 退出。 发现

```
[user@sombrero:~]$ ls
flag~  join  README.md

[user@sombrero:~]$ cat flag~
flag{think_different}

https://hellogkpie2024.zambar.xyz/
```

> join是Linux群的广告二维码

提交 `flag{think_different}` 提示

```
points 50 Congratulations, you know how to use ssh! But the flag is somewhere else on the ssh server!
```

```
[user@sombrero:~]$ find . -maxdepth 2 -name ".txt"
./.config/flag.txt

[user@sombrero:~]$ cat ./.config/flag.txt
flag{crazy_aryabhata}

https://hellogkpie2024.zambar.xyz/
```

总之就是要从合理的地方找一下，考察linux的熟练程度。

```

flag{crazy_aryabhata}
```

---

### Website

网页进入后发现是结束页面，下意识F12看一下，发现

```
console.log("我们不会在这个网页上面藏任何 flag :-)")
 <div class="container">
            <h1>感谢您的参与</h1>
            <p>
                你已经到达了世界的尽头。<br/>请按照比赛说明里面的步骤发送邮件，并静候佳音~
            </p>
            <!-- flag{978-7-309-16490-9} -->
            <!-- ModifiedIHDR.png -->
            <!--
          <img
            src="data:image/png;base64,很长很长很长很长很长的一段base64.........
```

得到了一个不正确的key

```
 flag{978-7-309-16490-9}
```

和一个看起来比较奇怪的图片。 应该是AI生成的可扫描二维码，但是缺少下半部分

![1729102980148.png](1496830284.png "1729102980148.png")

文件名是***ModifiedIHDR.png*** ， 谷歌搜索下可以发现是编辑了原始信息的文件。

偷一下懒，直接搜个[工具](https://entropymine.com/jason/tweakpng/)修改

导入之后提示文件末尾有垃圾信息，修改尺寸后得到

![1729109129960.png](2306299870.png "1729109129960.png")

解码得到

```
flag{Th15isTH3rE4lfL4g}
```

## E. [Complete?](https://hydro.ac/d/G3eKP1E_2024/p/P1005?tid=670d369c130a4aed4d83dbf7)

> There was supposed to be a hint here, but the hint went nowhere.

但是提示说了不会放在oj上面，所以不考虑这里。

---

***题解看D题的website部分***

---

把刚才的 `flag{978-7-309-16490-9}` 提交在这里可以拿到30分。

```
points 30 Find out more, maybe you should check that picture?
```

继续把 `flag{Th15isTH3rE4lfL4g}` 提交上去可以拿到满分。

> 结合得分可以知道这里的clue是刚才网页说的 *我们不会在这个网页上面藏任何 flag*

## F. [Clues](https://hydro.ac/d/G3eKP1E_2024/p/P1006?tid=670d369c130a4aed4d83dbf7)

### 1\. A题中推荐的网站是什么 -- 未解答

继续翻一下，发现 [https://github.com/ShanghaitechGeekPie/HelloGeekPie-2024/tree/some-good-books](https://github.com/ShanghaitechGeekPie/HelloGeekPie-2024/tree/some-good-books)

这里面有两本书，查看文件名看到有Z-lib的后缀。 `(Z-Library).pdf`

> 之前漏了 [something.txt](https://github.com/ShanghaitechGeekPie/HelloGeekPie-2024/commit/56c3803195e2a0289c869e151b149413789c796e#diff-53c436d8b7ce2d6b4c658adfc2c9b0ee35f775052eda373787205473955f41cdR1) `flag{is_this_the_flag?}`
>
> Zlib的官方网站是[singlelogin.re](singlelogin.re)
>
> Wiki: [https://en.wikipedia.org/wiki/Z-Library](https://en.wikipedia.org/wiki/Z-Library)
> Reddit: [https://www.reddit.com/r/zlibrary](https://www.reddit.com/r/zlibrary)
> X: [https://x.com/Z\_Lib\_official](https://x.com/Z_Lib_official)

### 2\. 谁说了 B 题中的话？（填写中文名）

> 《等待戈多》（ *Waiting for Godot* ）
>
> 这是在第一幕中由Lucky这个角色在长篇的独白里所说的内容

```
幸运儿
```

### 3\. 在多彩的 E 题的低处有什么？ -- 未解答

没看到。也许是说的半张二维码？

### 4\. A 题 Github repository 中，为了完成编译任务，需要补充的部分是什么？

[没看，好多东西](https://github.com/ShanghaitechGeekPie/HelloGeekPie-2024/tree/i-need-some-help)

是个Makefile

```
all:
    echo "There's no target ALL"

# Rule to compile
$(TARGET): $(SRC)
    $(CC) $(CFLAGS) -o $(TARGET) $(SRC)
```

简单修复即可, 顺便文件开头 `CFLAGS = -O0 -S -emit-llvm`

```
all: $(TARGET)

# Rule to compile
$(TARGET): $(SRC)
    $(CC) $(CFLAGS) -o $(TARGET) $(SRC)
```

运行后得到

```
lli my_job.ll
628
```

答案是

```
-emit-llvm
```

### 5\. 你应该立即开始学习操作系统，下面哪个概念和你的 windows 系统电脑上，占用了很多硬盘空间的 `pagefile.sys` 文件最相关？

~初音未来~

```
E. 内存管理单元（MMU）进行地址转换
```

### 6\. **Don't Panic** , 告诉我你的答案

```
42
```

> 《银河系漫游指南》（ *The Hitchhiker's Guide to the Galaxy* ）

## G. [Yet Another Web IDE](https://hydro.ac/d/G3eKP1E_2024/p/P1007?tid=670d369c130a4aed4d83dbf7) -- 未解答

~是个Python在线IDE，不会。~

发动了**社工**技能，网页开F12查看网络，发现了一大堆bin文件。

![1729151340934.png](3469230795.png "1729151340934.png")

这里我们用ResourceSaver插件保存全部内容。

从`distros/geekpy-riscv64/` 下面运行

```
sudo apt update
sudo apt install qemu qemu-system-misc

qemu-system-riscv64 \
    -machine virt \
    -m 256M \
    -bios ../../bios/bbl64.bin \
    -kernel ../../kernel/kernel-riscv64.bin \
    -append "console=hvc0 root=/dev/vda rw" \
    -drive file=../../distros/geekpy-riscv64/rootfs/blk.txt,format=raw,id=hd0 \
    -device virtio-blk-device,drive=hd0 \
    -netdev user,id=net0 \
    -device virtio-net-device,netdev=net0 \
    -nographic
```

启动阶段会报错，需要一些其他操作。没做。
