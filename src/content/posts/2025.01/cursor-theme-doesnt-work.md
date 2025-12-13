---
title: "Linux更换有些新光标主题时变回默认，但是光标样式预览能正常工作"
published: 2025-01-19
category: Linux
tags: [Linux, 桌面环境]
image: "./assets/cursor-theme-doesnt-work.png"
draft: false
---
# Linux更换有些新光标主题时变回默认，但是光标样式预览能正常工作

解释一下标题。KDE Plasma光标主题设置的那个位置是可以预览光标的样式的。具体些说，你可以把鼠标光标放到你想要看的光标位置上，你的鼠标光标就会变成对应的样式，方便你查看动画和光标的实际大小。

症状还包括：

- 重启电脑是不管用的。

- 删掉光标主题重装也不管用。（我在一次删掉光标主题的过程中`rm`路径一不小心输错了，把`.icons`删了，然后我重建目录的时候还把名字搞错了。重启N遍发现KDE认不出来主题。 ∠( ᐛ 」∠)）

- 基本是看脸发生。有些光标主题不这样，但是有些就一定会这样。

## 解决之法

来自[这里](https://github.com/supermariofps/hatsune-miku-windows-linux-cursors)的README。

翻译一下：

在KDE，桌面环境本身和一些程序可能默认回退至不是你选择的那个光标主题。为了修复这个， 把下面的配置添加到`/usr/share/icons/default/index.theme`或者`~/.local/share/icons/default/index.theme`

```toml
[Icon Theme]
Inherits=你的光标主题名称
```

---

实际上，如果这些配置已经有了的情况下，你只需要更改`Inherits=`后面的值

我个人推荐添加到`~/.local/share/icons/default/index.theme`。

然后**你还需要重启电脑或者重启你的桌面环境**。因为即使这样，原来打开的应用程序，包括桌面本身，还是会回退到默认。
