---
title: 'JavaScript中的异步资源管理和Promise竞态条件'
published: 2026-06-01
category: Javascript
tags: [Javascript, Promise, 异步]
---

## 最常见的资源管理

一个非常常见的资源管理的想法是这样的。用一个字符串获取资源的值。实现也很简单，新建一个`Map`，然后它包装到一个类里面。

```javascript
class ResourceManager {
  constructor() {
    // string key -> resource
    this.resourceMap = new Map();
  }

  getResource(key) {
    return this.resourceMap.get(key);
  }

  insert(key, value) {
    this.resourceMap.set(key, value);
  }
}
```

## 资源加载

资源来源主要有两个部分：其一是向网络中请求，其二是读取本地文件。这两种来源都是IO操作。所以一般使用 Promise 加载（而不是万恶的无限回调 QwQ）。这是我们在本文下面会用到的一个函数，它包装了[`setTimeout`](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout)，把它变成一个Promise。

```javascript
// Promise版本的setTimeout，返回一个Promise，将会在time毫秒后resolve。结果是time
function waitfor(time) {
  return new Promise((resolve) => setTimeout(resolve, time, time));
}
```

那么如何把结果正确且可靠地塞到我们刚刚看到的`ResourceManager`对象里？第一反应是在加载某某某的函数最后面把读到的资源放到`ResourceManager`里面。下面是这个想法的一个例子：

```javascript
async function loadProfileKaltsit() {
  // 等待一会，装作我们正在通过网络请求老猞猁的档案
  await waitfor(1000);
  const resource = { name: "Kal'tsit", age_atleast: 13000 };
  // 塞到ResourceManager里面
  resourceManager.insert("profile1", resource);
  return resource;
}

function outputKaltsit() {
  return new Promise((resolve) => {
    console.log(resourceManager.getResource("profile1"));
    resolve();
  });
}

const [loadP, outputP] = [loadProfileKaltsit(), outputKaltsit()];
await loadP;
await outputP;
```

输出：

```javascript
undefined
```

因为Promise是异步的。在第17行新建这两个Promise的时候，两个Promise的执行顺序不一定，这取决于调度器（比如在NodeJS环境中，将会取决于[libuv](https://libuv.org/)~~的心情~~）。

你可能会说按照顺序正确`await`两个不就可以了吗：

```javascript
await loadProfileKaltsit();
await outputKaltsit();
```

没错，在这个例子中确实能正常工作。但是在实际情况中，这两个函数的其中一个可能在`WebSocket`或者其他什么东西的消息回调里。那样根本无法预测顺序。

## 想法一

一个想法是给`ResourceManager`新加一个方法，使用资源的时候如果管理器里面没有，就加载。

```javascript
class ResourceManager {
  // ...

  // loader是一个接受ResourceManager对象的函数。
  // 它加载资源，把资源放到ResourceManager里面，然后返回一个带有结果的Promise。
  require(key, loader) {
    if (this.getResource(key) === undefined) {
      return loader(this);
    } else {
      return Promise.resolve(this.get(key));
    }
  }
}

async function loadProfileKaltsit(resourceManager) {
  console.log("加载老猞猁的档案");
  // 等待一会，装作我们正在通过网络请求老猞猁的档案
  // ...
  console.log("老猞猁的档案加载完成");
  return resource;
}

// step是编号（A或B）
async function outputKaltsit(step) {
  console.log(`${step} 调用`);
  const profile = await resourceManager.require("profile1", loadProfileKaltsit);
  console.log(profile);
}

const b = outputKaltsit("B");
await waitfor(100);
const a = outputKaltsit("A");

await randomDelay();
await b;
await randomDelay();
await a;
```

然后查看输出，你会发现加载器被错误调用了两遍：

```
B 调用
加载老猞猁的档案
A 调用
加载老猞猁的档案
老猞猁的档案加载完成
{ name: "Kal'tsit", age_atleast: 13000 }
老猞猁的档案加载完成
{ name: "Kal'tsit", age_atleast: 13000 }
```

在这个例子中，两次加载结果完全一样，对实际影响可能不大（除了浪费服务器流量以外）。但是实际中如果要加载的资源每次都有差别程序有可能爆炸。

这是因为，输出编号为A的那次调用在最开始的时候发现老猞猁的档案不存在，于是调用加载器。但是与此同时B的加载器刚好调用到半截。于是最终加载器被调用了两次。

## 解决方案

在`ResourceManager`内部再准备一个`Map`存放这个资源对应的正在运行Promise。如果在资源`Map`里面没有找到这个资源。就在Promise的`Map`里面找，如果有，返回这个Promise，否则再真正创建一个Promise进行加载。

下面是一个实现：

```javascript
class ResourceManager {
  //...

  // loader是一个接受ResourceManager对象的函数。
  // 它加载资源，把资源放到ResourceManager里面，然后返回一个带有结果的Promise。
  require(key, loader) {
    if (this.resourceMap.has(key)) {
      return Promise.resolve(this.resourceMap.get(key));
    }
    if (this.pendingMap.has(key)) {
      return this.pendingMap.get(key);
    }
    const promise = loader(this)
      .then((result) => {
        this.pendingMap.delete(key);
        return result;
      })
      .catch((error) => {
        this.pendingMap.delete(key);
        throw error;
      });
    this.pendingMap.set(key, promise);
    return promise;
  }
}

async function loadProfileKaltsit() {
  console.log("加载老猞猁的档案");
  await waitfor(1000);
  const resource = { name: "Kal'tsit", age_atleast: 13000 };
  console.log("老猞猁的档案加载完成");
  return resource;
}

async function outputKaltsit(step) {
  console.log(`${step} 调用`);
  const profile = await resourceManager.require("profile1", loadProfileKaltsit);
  console.log(profile);
  return profile;
}
```

输出：

```
B 调用
加载老猞猁的档案
A 调用
老猞猁的档案加载完成
{ name: "Kal'tsit", age_atleast: 13000 }
{ name: "Kal'tsit", age_atleast: 13000 }
```

可以看到结果正确了。

## 更新：改进

Promise会存储结果，所以不用存储结果到一个专门的Map里面，可以直接存Promise。

```javascript
class ResourceManager {
  constructor() {
    // string key -> Promise
    this.pendingMap = new Map();
  }

  require(key, loader) {
    if (this.pendingMap.has(key)) {
      return this.pendingMap.get(key);
    } else {
      const promise = loader(this).catch((error) => {
        this.pendingMap.delete(key);
        throw error;
      });
      this.pendingMap.set(key, promise);
      return promise;
    }
  }
}

async function loadProfileKaltsit() {
  console.log("加载老猞猁的档案");
  await waitfor(1000);
  const resource = { name: "Kal'tsit", age_atleast: 13000 };
  console.log("老猞猁的档案加载完成");
  return resource;
}

const b = outputKaltsit("B");
await waitfor(100);
const a = outputKaltsit("A");

await randomDelay();
const br = await b;
await randomDelay();
const ba = await a;
```

两次await的结果是一样的，它们都是同一个对象：

```javascript
console.log(ba === br); // true
```
