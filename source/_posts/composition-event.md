---
title: DOM 中的 CompositionEvent
date: 2020-01-04 23:06
tags: [HTML5, ES6, UI]
---

从实际的例子出发：实现一个依据用户输入首字符实时搜索（过滤）功能，身为前端开发的你会怎么做？很简单，只需要一个 `<input>` 标签和一点点 JavaScript 代码。

```html
<input type="text" />
<script>
  const data = ['apple', 'banana', 'orange']
  const inputEl = document.querySelector('input')

  inputEl.addEventListener('input', e => {
    const value = e.target.value
    console.log(data.filter(item => item.startsWith(value[0])))
  })
</script>
```

确实完成了功能。但是有个问题：上述代码无法处理原始数据中包含中文的情况。例如测试数据如下：

```js
const data = ['apple', 'banana', 'orange', '苹果', '香蕉', '橘子']
```

你会发现在输入中文（例如要搜索“苹果”二字）的时候，输入框中首先出现了虚拟字符（拼音输入：'pingguo'，五笔输入：'agjs'，其他输入法类似）。那么问题就来了，因为代码中监听了 `input` 事件，每次键盘输入时都会触发，那么虚拟字符就会影响到匹配的结果。本来想匹配“苹”字开头的数据，结果 'p'（或者 'a'）开头的数据也匹配到了。如何解决这个问题呢？现在就轮到 CompositionEvent 出马了。

## 概念

DOM 中的 CompositionEvent 表示由于用户间接输入文本而发生的事件，包括以下三种事件：`compositionstart`、`compositionupdate`、`compositionend`。从命名上就可以看出来，这三种事件分别在输入法输入非拉丁字符开始时、更新时、结束（或者取消）时触发。

```js
const handler = (e) => console.log(e.type)

inputEl.addEventListener('compositionstart', handler)
inputEl.addEventListener('compositionupdate', handler)
inputEl.addEventListener('compositionend', handler)
```

用上述代码测试输入中文时的输出如下：

```
compositionstart
compositionupdate
compositionend
```

其中 `compositionupdate` 事件触发的次数由你输入中文时输入框虚拟字符改变的次数决定（联想英文输入时的 `input` 事件）。

## 解决方案

了解了 CompositionEvent，上面说到的问题就很容易解决了。我们在 `input` 事件中加入锁（Flag），然后在 
 CompositionEvent 开始与结束时开关锁，这样一来，输入法引入的虚拟字符就无法干扰正常的处理流程了。

```js
let flag = true

inputEl.addEventListener('compositionstart', () => flag = false)
inputEl.addEventListener('compositionend', () => flag= true)
inputEl.addEventListener('input', e => {
  setTimeout(() => {
    if (flag) {
      // TODO
    }
  }, 0)
})
```
**要注意的是因为 `input` 事件先于 `compositionend` 事件触发，代码添加了 `setTimeout` 调整了先后顺序。**

## 触发顺序

DOM 事件的触发顺序非常重要，稍有不慎就会出现各种问题。我们来用实际代码测试一下 `<input>` 元素上常用的事件触发的先后顺序。

```js
const handler = (e) => console.log(e.type)

inputEl.addEventListener('compositionstart', handler)
inputEl.addEventListener('compositionupdate', handler)
inputEl.addEventListener('compositionend', handler)
inputEl.addEventListener('input', handler)
inputEl.addEventListener('change', handler)
```

输入中文时的输出如下：

```
compositionstart
compositionupdate
input
compositionupdate
input
compositionupdate
input
compositionend
change
```

其中 `change` 事件在输入框失去焦点或者键入回车键时触发。**注意：React 中 `change` 事件与 `input` 事件是一起触发的，没有区别（[参考](https://stackoverflow.com/questions/38256332/in-react-whats-the-difference-between-onchange-and-oninput)）。**框架与库的引入一方面提升了我们的开发效率，另一方面也掩盖了底层的一些问题。特别要注意这些框架实现与原生支持之间的差异，出了问题应当能够迅速定位所在，这也是优秀开发能力的体现。

## 结语

说来惭愧，做前端开发这些年来，还是第一次了解到这个知识点。但是没有关系，解决问题之后有所得就可以了。在日常的开发中，我们有大把的机会提升自己的技术储备，不要浪费这些机会，深挖一下，也许就有意想不到的收获。
