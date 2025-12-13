---
title: '退出KDE进入tty模式的方法'
published: 2024-06-02
category: Linux
tags: [Linux, 桌面环境, KDE Plasma]
draft: false
image: './assets/blockydeer@debian-bash.png'
---

# 退出KDE进入tty模式的方法

好久没写博客了OvO

今天又把我的Debian搞炸了，一塌糊涂。遂重装。

于是装显卡驱动时候又遇到那个老问题：KDE怎么退出进入tty？

在一番搜索以后，发现网上的方法都不管用，结果自己歪打正着试出来了。

方法很简单：

1. 打开KDE的终端，键入命令：  
```bash
sudo init 3
```
然后输入密码，回车。

2. 执行完毕以后可能屏幕会闪一下，没有关系，是正常现象。
3. 关掉终端窗口。点左下角的开始（你的开始按钮可能在别的地方，没有关系），选择「注销」（而不是「关机」「重启」之类的）。
4. 好了，现在你已经进入tty了。输入root和root密码登录吧。
