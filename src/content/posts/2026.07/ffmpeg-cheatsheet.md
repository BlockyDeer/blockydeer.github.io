---
title: "FFmpeg 命令速查（不用剪辑软件快速剪辑）"
published: 2026-07-17
category: FFmpeg
tags: [FFmpeg, shell]
draft: false
---

## 命令格式的吐槽（请跳过这部分）

ffmpeg和其他[Fabrice Bellard](https://en.wikipedia.org/wiki/Fabrice_Bellard)写的软件一样。拥有看了让人一头雾水的命令选项。一个命令有起码两种写法。有些更是没有文档可以看。这里使用我认为最短的选项写法。 _因为懒_

## 基础选项解释

### `-i` 指定输入文件

不一定非得是输入的视频，还可能是音频，字幕文件，图片等。

### `-c:a` `-c:v` `-c:s` 指定对`a`（音频）`v`（视频）`s`（字幕）做什么（转码等）

比如`-c:a copy`表示原样复制音频轨道（而不是默认的转码）

### `-vf` 视频滤镜， `af` 音频滤镜

> Simple filtergraphs are those that have exactly one input and output, both of the same type (audio or video). They are configured with the per-stream -filter option (with -vf and -af aliases for -filter:v (video) and -filter:a (audio) respectively). Note that simple filtergraphs are tied to their output stream, so e.g. if you have multiple audio streams, -af will create a separate filtergraph for each one.

### `-ss` 指定位置

格式是：

```
-ss 00:00:15.000
```

分别是HH:MM:SS。小数点后面是十进制的秒数（即小数点后的第一位表示十分之一秒，第二位是百分之一秒）

或者：

```
-ss 10+7ms
```

表示10秒加上7毫秒。

### `-crf`

后跟一个整数，控制输出质量。

1. 对于`x264`：在18和28之间，默认是23
2. 对于`x265`：默认是28
3. 对于`libvpx`：没有默认值，取值在0到63之间
4. 如果你想用`av1`：取值在0到63之间。默认值取决于具体编解码器。

视频质量随着数值减小而增加。（换言之18比23看上去更清晰。）

更多信息，参见：<https://slhck.info/video/2017/02/24/crf-guide.html>

### `-preset`

同样用于控制质量。常见的：

较慢的预设会带来更好的压缩率，较快的预设会带来更差的压缩。可以是：`ultrafast`, `superfast`, `veryfast`, `faster`, `fast`, `medium`（默认）, `slow` 和 `veryslow`。总结：按照你的经验选择。 ~~_自己看着办_~~

## 查看视频信息

VLC可以看到一些信息：

使用VLC打开视频。菜单栏->`工具`->`媒体信息`或者`编解码器信息`

`ffprobe`是一个查看视频信息的不错的工具：

```bash
ffprobe input.mp3
```

示例输出：

```bash
➜  ~ ffprobe 'くるくるぱぁ-初音ミク for LamazeP - sm24347485.mkv' 
ffprobe version n8.1.2 Copyright (c) 2007-2026 the FFmpeg developers
  built with gcc 16 (GCC)
  configuration: --prefix=/usr --disable-debug --disable-static --disable-stripping --enable-amf --enable-avisynth --enable-cuda-llvm --enable-lto --enable-fontconfig --enable-frei0r --enable-gmp --enable-gnutls --enable-gpl --enable-ladspa --enable-lcms2 --enable-libaom --enable-libass --enable-libbluray --enable-libbs2b --enable-libdav1d --enable-libdrm --enable-libdvdnav --enable-libdvdread --enable-libfreetype --enable-libfribidi --enable-libglslang --enable-libgsm --enable-libharfbuzz --enable-libiec61883 --enable-libjack --enable-libjxl --enable-libmodplug --enable-libmp3lame --enable-libopencore_amrnb --enable-libopencore_amrwb --enable-libopenjpeg --enable-libopenmpt --enable-libopus --enable-libplacebo --enable-libpulse --enable-librav1e --enable-librsvg --enable-librubberband --enable-libsnappy --enable-libsoxr --enable-libspeex --enable-libsrt --enable-libssh --enable-libsvtav1 --enable-libtheora --enable-libv4l2 --enable-libvidstab --enable-libvmaf --enable-libvorbis --enable-libvpl --enable-libvpx --enable-libwebp --enable-libx264 --enable-libx265 --enable-libxcb --enable-libxml2 --enable-libxvid --enable-libzimg --enable-libzmq --enable-nvdec --enable-nvenc --enable-opencl --enable-opengl --enable-shared --enable-vapoursynth --enable-version3 --enable-vulkan --disable-decoder=magicyuv
  libavutil      60. 26.102 / 60. 26.102
  libavcodec     62. 28.102 / 62. 28.102
  libavformat    62. 12.102 / 62. 12.102
  libavdevice    62.  3.102 / 62.  3.102
  libavfilter    11. 14.102 / 11. 14.102
  libswscale      9.  5.102 /  9.  5.102
  libswresample   6.  3.102 /  6.  3.102
Input #0, matroska,webm, from 'くるくるぱぁ-初音ミク for LamazeP - sm24347485.mkv':
  Metadata:
    COMPATIBLE_BRANDS: isomiso2avc1mp41
    MAJOR_BRAND     : isom
    MINOR_VERSION   : 512
    ENCODER         : Lavf62.12.102
  Duration: 00:03:27.51, start: 0.000000, bitrate: 2106 kb/s
  Stream #0:0: Video: h264 (Main), yuv420p(tv, bt709, progressive), 1280x720 [SAR 1:1 DAR 16:9], 30 fps, 30 tbr, 1k tbn (default)
    Metadata:
      HANDLER_NAME    : VideoHandler
      DURATION        : 00:03:18.733000000
  Stream #0:1: Audio: aac (LC), 44100 Hz, stereo, fltp (default)
    Metadata:
      HANDLER_NAME    : SoundHandler
      DURATION        : 00:03:18.763000000
  Stream #0:2: Subtitle: ass (ssa)
    Metadata:
      DURATION        : 00:03:27.510000000
```

## 关于中间文件

很多时候我们不得不使用中间文件。如果你担心对硬盘写入太多影响寿命，你可以把视频输出到`/tmp`。

至于Windows，可以用[RAMDisk](https://en.wikipedia.org/wiki/List_of_RAM_drive_software)软件。或者如果你只关心自动删除，输出到`C:\Users\你的用户名\AppData\Local\Temp`也是一个不错的选择。

## 正片

### 转换格式

把`mp4`封装转换为`mkv`封装：

```bash
ffmpeg -i input.mp4 output.mkv
```

如果你不想转码：

```bash
ffmpeg -i input.mp4 -c:v copy -c:a copy output.mkv
```

这一般情况下会更快。

### 合并音频和视频

```bash
ffmpeg -i input.mp4 -i input.mp3 -c:v copy -c:a copy output.mp4
```

我一般用于抓取B站视频和音频以后手工合并。

### 提取音频

```bash
ffmpeg -i input.avi -vn -c:a copy output-audio.aac
```

这里`-vn`表示不要输出视频轨道

#### 关于这里的`-c:a copy`

这里尝试直接复制。取决于目标编码和源编码，可能会不兼容，这时候就必须转码（转码的话删掉这部分就可以了）。

### 改变音量

把音量变为原来的7倍（大约是+16.9dB）：

```bash
ffmpeg -i input.mp4 -af volume=7 -c:v copy output.mp4
```

很不幸地，7倍是一个非常大的数值，很有可能会导致削波……

如果你想要尝试添加限制器来避免削波：

```bash
ffmpeg -i input.mp4 -af "volume=7,alimiter" -c:v copy output.mp4
```

[音频归一化](https://en.wikipedia.org/wiki/Audio_normalization)：

```bash
ffmpeg -i input.mp4 -af loudnorm -c:v copy output.mp4
```

### 转换视频编码

比如原来是[h265](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding)，你想转换到[h264](https://en.wikipedia.org/wiki/High_Efficiency_Video_Coding)，音频直接复制：

```bash
ffmpeg -i input.mp4 -c:v libx264 -c:a copy -crf 18 output.mp4
```

关于`-crf`和`-preset`选项的数值参照[前文](#-crf)。

### 向视频封装中添加字幕文件（外挂字幕）

比如你的字幕文件是`subtitles.ass`：

```bash
ffmpeg -i input.mp4 -i subtitles.ass -c:v copy -c:a copy -c:s copy output.mkv
```

**注意`mp4`封装不支持内置字幕轨道。**

### 烧录字幕（内嵌字幕）

这是把字幕「焊接」到视频帧上：

```bash
ffmpeg -i input.mp4 -vf ass=subtitles.ass output.mp4
```

### 提取视频中的某一帧或者一些帧

如果你想要只提取一帧，[VLC](https://en.wikipedia.org/wiki/VLC_media_player)可以干这个：用VLC打开视频，调整到你想要的位置，右键视频，选择`视频`->`截图`。然后它会提示你保存在哪了，打开那个路径就能看到结果。

提取一帧的ffmpeg版本（这个版本非常准确，因为它允许你指定具体数值）：

```bash
ffmpeg -i input.mp4 -ss 00:00:10.000 -vframes 1 output.png
```

如果你想要一段内的全部帧：（1到5秒内的所有帧以及11秒到15秒的所有帧）

```bash
ffmpeg -i input.mp4 -vf select='between(t,1,5)+between(t,11,15)' output_%d.png
```

注意那两个单引号，逗号在bash中有特别含义。

### 更改帧大小（缩放视频）

比如你的视频是2560x1440的，你想要缩放到1920x1080

```bash
ffmpeg -i input.mp4 -vf scale=1920:1080 output.mp4
```

如果你觉得默认的参数输出太糊，想要更高质量：

```bash
ffmpeg -i input.mp4 -vf scale=1920:1080 -preset slow -crf 18 output.mp4
```

关于`-crf`和`-preset`选项的数值参照[前文](#-crf)。

如果你希望保持纵横比，只关心目标宽或高。把另一个设置为-1即可。这是一个例子，等比缩放，让高是1080：

```bash
ffmpeg -i input.mp4 -vf scale=-1:1080 -preset slow -crf 18 output.mp4
```

### 转换视频为`.gif`（制作赛博琥珀）

在这个问题上，使用ffmpeg的好处是你可以自己任意控制输出质量，达到更好的效果，而不是像大部分在线转换网站一样不给你任何选项。

从视频的第30秒开始，提取3秒的时长，设置帧率为10fps，保持宽高比缩放到320像素宽，让gif循环：（冷知识，gif最初被创造出来的时候是一种图片格式，动图是附带功能）

```bash
ffmpeg -ss 30 -t 3 -i input.mp4 -vf "fps=10,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" -loop 0 output.gif
```

这里`palettegen`用于生成调色板，`paletteuse`用于使用刚刚生成的调色板。更多选项在[这里](https://ffmpeg.org/ffmpeg-filters.html#toc-palettegen-1)

## 参考

<https://gist.github.com/steven2358/ba153c642fe2bb1e47485962df07c730>  
<https://ffmpeg.org/ffmpeg.html>  
<https://ffmpeg.org/ffmpeg-filters.html>  
<https://ffmpeg.org/ffmpeg-utils.html>  
<https://man.archlinux.org/man/ffmpeg.1.en>  
<https://stackoverflow.com/questions/60257883/is-it-possible-to-change-volume-with-no-reencode-with-ffmpeg>  
<https://superuser.com/questions/323119/how-can-i-normalize-audio-using-ffmpeg>  
<https://superuser.com/questions/490683/cheat-sheets-and-preset-settings-that-actually-work-with-ffmpeg-1-0>
