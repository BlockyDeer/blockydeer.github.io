---
title: 'Bevy Engine 中的 ECS（延迟更改、查询操作）'
published: 2025-12-25
category: Bevy Engine
tags: [Rust, Bevy Engine, Bevy, ECS, 游戏开发]
---

我这里使用的 Bevy Engine 版本是`0.17.3`，于2025年11月18日发布：

```toml
[dependencies]
bevy = { version = "0.17.3", features = ["dynamic_linking"] }
```

## 关于 ECS (Entity Component System)

这是我的博客中提到 ECS 的第一篇文章。我想我需要先对 ECS 进行一个快速概述。

关于 ECS 的概述可以在这里找到：<https://github.com/SanderMertens/ecs-faq>

我这里说一下我的理解：

- 实体（或者对象）由组件组合而成。比如Minecraft中的僵尸：`Zombie = Entity + Mob + Hostile + Alive + Health + ...` （实体 + 怪物 + 敌对 + 活着的东西 + 生命值）。
- 组件负责存储数据。在僵尸的例子中，Health组件可以存储僵尸的血量：`struct Health { hp: f32 }`
- 系统用于赋予世界上的东西逻辑。比如我们可以使用一个系统让僵尸移动。

需要注意的是：

- **组件**只存储数据，**不包含逻辑**。
- **系统不能存储**（游戏的）**数据**。

## Bevy 中的系统

Bevy 中的系统只是一些符合某些样式的 Rust 函数。比如让我们的僵尸在阳光下着火：

我这里假设僵尸拥有以下组件：`Zombie`, `Mob`。

```rust
fn zombie_set_on_fire(mut cmd: Command, query: Query<(&Zombie, &Mob)>) {
    for (zombie, mob) in &query {
        // 做些什么
    }
}
```

系统的参数列表里面可以放很多东西。这篇文章我们只关心`Command`和`Query`。

## 查询（`Query`）

`Query`表明一个「查询结果」。

它的类型列表可以放：

- 借用类型元组。比如刚刚的`(Zombie, Mob)`。此时它表示：我想要查询所有同时拥有`Zombie`和`Mob`组件的实体。
- 主组件，带有次要组件的「关键字」的列表。比如`Query<&Mob, With<Zombie>>`表示查询所有同时拥有`Zombie`和`Mob`组件的实体。

常见「关键字」：

- `With<C>`: 并且拥有`C`。
- `Without<C>`: 没有`C`。
- `Or<A, B>`: 拥有`A`或者`B`。

### 二者有什么区别呢？

类型元组允许你获取两者的值：

```rust
fn some_system(mut cmd: Command, query: Query<(&Position, &Velocity)>) {
    for (position, velocity) in &query {
        // 此时position的类型是Position，velocity的类型是Velocity
        // 做点什么
    }
}
```

后者不允许你获取值，它只保证满足「关键字」条件。

```rust
fn some_system(mut cmd: Command, query: Query<&Position, With<Velocity>>) {
    for position in &query {
        // 此时position的类型是Position，你没法获取Velocity组件的值。
        // 做点什么
    }
}
```

此外，前者可能阻止一些系统并行运行。而后者不会。

总之：

- 关心值：使用类型元组。
- 只关心「有没有」：使用`With<C>`。

### 立即更新值

给`Query<...>`和在查询要改变的东西标上`mut`即可。比如按照速度更新位置：

```rust
#[derive(Component)]
struct Position(f32, f32);

#[derive(Component)]
struct Velocity(f32, f32);

fn update_position(mut query: Query<(&mut Position, &Velocity)>) {
    for (mut position, velocity) in &mut query {
        position.0 += velocity.0;
        position.1 += velocity.1;
    }
}
```

## 延迟更新

使用立即更新值可能会造成一些混乱，因为系统的执行顺序可能并不是那么明显。或者你可能不太关心系统的执行顺序。

使用延迟更新可以把组件更新推迟到帧末。在帧末，Bevy 会用缓冲区的值覆盖世界里的数据。

延迟更新的实现方法是使用 `Commands` ：

```rust
#[derive(Component)]
struct Data(i32);

fn setup(mut cmd: Commands) {
    cmd.spawn(Data(3));
}

fn change(mut cmd: Commands, query: Query<(Entity, &Data)>) {
    for (e, d) in &query {
        let original_val = d.0;
        println!("d changed from {} to {}", original_val, original_val + 1);
        cmd.entity(e).insert(Data(original_val + 1));
    }
}

fn read(_cmd: Commands, query: Query<&Data>) {
    for d in query {
        println!("Read value: {}", d.0);
    }
}

fn main() {
    let mut app = App::new();
    app.add_systems(Startup, setup)
        .add_systems(Update, read)
        .add_systems(Update, change);
    app.update();
    println!("===============");
    app.update();
}
```

输出：

```
d changed from 3 to 4
Read value: 3
===============
d changed from 4 to 5
Read value: 4
```

一些解释：

- 这里`app.update();`的作用是让Bevy运行一遍所有系统。因为我没有引入`DefaultPlugins`。使用`app.run();`会让所有系统只运行一遍，效果不是很明显。
- `cmd.spawn(...)`方法是延迟生效的。

关于`Commands`结构的其他用法请参见：<https://docs.rs/bevy/0.17.3/bevy/ecs/prelude/struct.Commands.html>

