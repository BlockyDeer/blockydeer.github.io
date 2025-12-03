# （水）使用你喜欢的任何编译系统编译 GDExtension（在 Godot 使用 C++）

Godot 的文档在 [GDExtension 部分](https://docs.godotengine.org/zh-cn/4.x/tutorials/scripting/cpp/gdextension_cpp_example.html)的开头是这样说的（中间的加粗是我加的，原文没有）：

> 这里有一些前置需求是你需要的：  
> A Godot 4 executable.  
> A C++ compiler.  
> **使用 Scons 作为构建工具。**  
> A copy of the godot-cpp repository.

但是我们真的必须用 [Scons](https://www.scons.org/) 作为构建工具构建你自己的 GDExtension 吗？当然不。下面是你需要做的事情：

1. 新建一个 GDExtension。（同文档）
2. 添加头文件路径。
3. 添加库搜索路径。
4. 链接 godot-cpp 的构建产物。
5. 指定输出名字等必要信息。

## 新建一个 GDExtension

我的做法是使用`git submodule`添加`godot-cpp`到我的项目下：

```bash
mkdir godot-cpp-test && cd godot-cpp-test
git init
git submodule add -b 4.5 https://github.com/godotengine/godot-cpp
```

然后让 godot 生成`extension_api.json`：

```bash
godot --dump-extension-api
```

然后编译`godot-cpp`：

```bash
cd godot-cpp
scons platform=<platform> custom_api_file=../extension_api.json
cd ..
```

接下来新建你的源代码文件，我这里直接用了`lib.cpp`作为名字。你的可能有多个，那些都无伤大雅。

```bash
emacs lib.cpp
```

## 添加头文件路径

对于 GCC 和 Clang，使用`-I`选项来指定头文件路径。你需要添加以下几个目录：

- `godot-cpp/gen/include`
- `godot-cpp/include`
- `godot-cpp/gdextension`

例子：

```bash
g++ lib.c -o demo/bin/libgdexample -shared -fPIC -Igodot-cpp/gen/include -Igodot-cpp/include -Igodot-cpp/gdextension
```

xmake 的写法：

```lua
add_rules("mode.debug", "mode.release")

target("gdexample")
    set_kind("shared")
    add_files("lib.cpp")
    add_includedirs("godot-cpp/gen/include")
    add_includedirs("godot-cpp/include")
```

## 添加库搜索路径

对于 GCC 和 Clang，使用`-L`选项来指定库文件搜索路径，因为你需要链接`godot-cpp/bin/libgodot-cppxxx.xxx.xxx.so`，即`godot-cpp`的产物。

你需要添加的目录是：`godot-cpp/bin`

例子：

```bash
g++ lib.c -o demo/bin/libgdexample -shared -fPIC -Igodot-cpp/gen/include -Igodot-cpp/include -Igodot-cpp/gdextension -Lgodot-cpp/bin
```

xmake：

```lua
...
target("gdexample")
    ...
    add_linkdirs("godot-cpp/bin")
```

## 链接 godot-cpp 的构建产物

对于 GCC 和 Clang，使用`-l`选项来指定库文件名字

Scons 生成的文件名会带上平台等信息。所以你需要自行拼接文件名。我这里直接把它写死在脚本里了：

```bash
g++ lib.c -o demo/bin/libgdexample -shared -fPIC -Igodot-cpp/gen/include -Igodot-cpp/include -Igodot-cpp/gdextension -Lgodot-cpp/bin -llibgodot-cpp.linux.template_debug.x86_64.a
```

xmake:

```lua
...
target("gdexample")
    ...
    add_linkdirs("godot-cpp/bin")
    add_links("libgodot-cpp.linux.template_debug.x86_64.a")
```

## 指定输出名字等必要信息。

我推荐直接生成到 Godot 项目路径的`bin`目录下，节省手动复制或剪切文件的时间。

至于文件名。我推荐和 Scons 保持一致（也就是说你需要自己拼接包含平台等信息的文件名），否则你在下一步可能会陷入文件名不够用的窘境。

```bash
g++ lib.c -o demo/bin/libgdexample.linux.template_debug.x86_64.so -shared -fPIC -Igodot-cpp/gen/include -Igodot-cpp/include -Igodot-cpp/gdextension -Lgodot-cpp/bin -llibgodot-cpp.linux.template_debug.x86_64.a
```

xmake:

```lua
add_rules("mode.debug", "mode.release")

set_targetdir("demo/bin")

target("gdexample")
    ...
    set_filename("libgdexample.linux.template_debug.x86_64.so")
```
