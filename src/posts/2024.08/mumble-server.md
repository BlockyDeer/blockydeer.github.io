---
title: "Mumble服务器搭建及新建频道、更改频道名称"
date: 2024-08-10T12:47:05+08:00
draft: false
featured_image: 'posts/2024.08/assets/mumble.png'
---

# Mumble服务器搭建及新建频道、更改频道名称

我因为受不了某些 Mumble 公共服务器，遂打算自己搭一个。然后就开始了踩坑，这里从 0 开始手把手教你搭建。

**_这篇教程适用于 Linux，Windows 用户请出门左转搜索引擎处寻找你想要的教程。_**

系统方面我使用的是 Debian Linux 12

## 需求

这篇教程假设你已经：

- 已经设置好镜像源（当然，如果你说你用的是 Debian 官方源也算）
- 拿到机子后系统更新完毕
- 新建了普通用户（这里我新建的普通用户用户名为`blockydeer`）
- 你的用户有`sudo`权限

## 安装 Mumble 服务端

我这里使用的是 Debian 软件仓库里的`mumble-server`包。我们现在安装它：

```bash
sudo apt install mumble-server
```

**_（以下是可选的，可能能满足你的强迫症）_**

暂时先把 Mumble 服务端停掉：

```bash
sudo systemctl stop mumble-server
```

## 配置

### 配置文件

配置分为两部分，我们先看最简单的那部分。

Mumble 服务端的配置文件默认在

```bash
/etc/mumble-server.ini
```

我们只需使用文本编辑器打开编辑它就行了：

```bash
sudo emacs -nw /etc/mumble-server.ini
```

（你可以用 vim 或者其他你喜欢的文本编辑器）

我们重点关注那么几行：

```ini
; Port to bind TCP and UDP sockets to.
port=
; Password to join server.
serverpassword=
; Maximum bandwidth (in bits per second) clients are allowed
; to send speech at.
bandwidth=

;registerName=
```

比较短的注释我也复制粘贴上去了。

解释一下这些都是干啥的：

- `port`：服务器端口号
- `serverpassword`：如果你不想让所有人都能进来，你可以设置一个服务器连接密码。因为证书的存在，他们只需要输入一次。
- `bandwidth`：带宽限制，主要和客户端可以开多大录音质量有关。默认值是 72000。
- `registerName`：一个用处是根频道名称。你可能会发现它前面有分号——被注释掉了，如果你想你的服务器根频道名字，你不仅要填入新的值，还需要删掉前面的分号。  
  ~~分号删完以后一定要检查一下有没有删多了，别问我怎么知道的。我用的 emacs 按搜索快捷键手滑了……~~

配置文件改完了可以重启一下Mumble服务端看看效果：

```bash
sudo systemctl restart mumble-server
```

---

**致在上一节强迫症发作而暂时停掉Mumble服务端的强迫症们：**

这个位置你需要「启动Mumble服务端」，而不是「重启Mumble服务端」：

```bash
sudo systemctl start mumble-server
```

### 设置频道（获取Mumble服务器管理员权限）

在这一小节中，你需要额外准备一个Mumble客户端（要不然你拿什么连接你的Mumble服务器呢）。

打开你的Mumble客户端，选择上面的`服务器`->`连接`->`添加`，填写信息。

不知道怎么填？下面是简易指导：

- 地址：你的服务器IP，如果你使用的是域名就填域名。
- 端口：你的Mumble所使用的端口号，如果你在上一小节中更改了`port`项的值，请填你更改的数值，否则不要管它。
- 用户名：这个和你的Linux系统的服务器本身没有任何关系，只是用于你用来在Mumble服务器内活动所用的用户名，你可以自己起一个。
- 别名：可以给自己的服务器写个备注。（填完以后别忘了自己写了啥。）

接下来连接服务器。

右键你自己，选择`注册`。Mumble可能会警告你注册后用户名就不能改了。

确保不再更改用户名以后直接确定。

接下来你需要想出一个密码用作超级用户密码。

回到你的ssh，使用命令：

```bash
sudo murmurd -ini /etc/mumble-server.ini -supw 你的密码
```

回到你的客户端，断开连接。选择`服务器`->`连接`，找到你的服务器右键->`编辑`。把用户名改成`SuperUser`，密码填你刚刚想的密码。

应该可以正确连接。如果没有，Mumble抱怨密码不对之类的，请检查密码是不是输错了。如果没有，再检查下前面是不是有步骤出错了。

接下来你就可以做你想做的事情了。右键频道可以显示右键菜单。

设置好了不要忘了把用户名改回你平常用的那个。

#### 官网的方法

[官方Wiki传送门](https://wiki.mumble.info/wiki/Main_Page)

我上面的方法就是按照[官方Wiki的方法](https://wiki.mumble.info/wiki/Murmurguide#Becoming_Administrator_and_Registering_a_User)改的。

官方wiki还记载了其他方法，在更改SuperUser用户的密码方面，有其他两种方法：

- 静态服务器

```bash
./murmur.x86 [-ini <path>] -supw Password_of_your_choice
```

- murmur-user-wrapper

```bash
murmur-user-wrapper -p Password_of_your_choice
```

但在我的服务器，只有`murmurd`方法起作用。
