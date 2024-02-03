---
title: '主动掉落物品时显示"Cannot drop air"'
date: 2024-02-03T17:20:54+08:00
draft: false
featured_image: 'posts/2024.02/assets/redstone.png'
---

# 主动掉落物品时显示"Cannot drop air"

那天我试着开发一款限制服务器内的高频红石的插件。具体做法是：

1. 检测高频闪烁的红石粉
2. 闪烁次数到达一定次数后将它掉落出来

于是理所当然的写下了下面的代码：

```java
    block.getWorld().dropItem(block.getLocation(), new ItemStack(block.getType()));
    block.setType(Material.AIR);
```

其中，`block`是已满足条件的方块。

但是我在测试的时候，红石线一开始闪，瞬间服务器后台开始报"Cannot drop air"，一堆一堆的这样的红色提示刷屏。

## 为什么

请思考下[红石线](https://minecraft.fandom.com/zh/wiki/%E7%BA%A2%E7%9F%B3%E7%B2%89)是什么东西，[红石粉或者红石](https://minecraft.fandom.com/zh/wiki/%E7%BA%A2%E7%9F%B3%E7%B2%89)又是什么东西。

---

[红石](https://minecraft.fandom.com/zh/wiki/%E7%BA%A2%E7%9F%B3%E7%B2%89)或[红石粉](https://minecraft.fandom.com/zh/wiki/%E7%BA%A2%E7%9F%B3%E7%B2%89)是一种物品，长这样：

![红石](../assets/redstone_scaled.png)

而红石线是一种方块，它长这样：

![红石线](../assets/redstone_wire.png)

红石线有没有对应的物品呢？高版本当然没有。

所以试图掉落红石线本身都会失败，因为根本不存在这个物品。据别人说，这和Bukkit API有关。我也不知道，也不敢瞎说。

所以正确的写法是：

```java
    Material type = block.getType();
    if (type == Material.REDSTONE_WIRE) {
        type = Material.REDSTONE;
    }
    block.getWorld().dropItem(block.getLocation(), new ItemStack(type));
    block.setType(Material.AIR);
```
