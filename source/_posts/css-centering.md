---
title: CSS 居中元素
date: 2018-02-01 16:17:02
tags: [CSS, UI]
---

## 前言
如何在 CSS 居中元素对新手（我就是）来说一直是一个老大难问题，关键在于页面元素居中的情景多变（水平居中、垂直居中或者水平垂直同时居中）而且有多种实现方式。从多种方式中选择适合场景的方法，对 Web 页面的稳定性至关重要。

**注意：下文会将需要定位的元素描述为子元素（文本描述为内容），外层元素描述为父元素（包含文本的元素描述为容器元素）。**

## 水平居中
水平居中是最简单的。原生的 CSS 属性 `text-align: center` 即可起到作用。注意此样式是加在块级父元素上的，我们把行内子元素当成内容，让其居中定位即可。如果子元素是块元素，可以在设定宽度的情况下使用 `margin: 0 auto` 让浏览器帮我们自动居中。使用 CSS 应尽量让浏览器发挥作用，避免浏览器的回流和重绘。

顺便说一句，我感觉要想学好 CSS，熟悉基本属性的用法和明确兼容性差异只是基础，更重要的是在熟练使用这些属性和解决兼容性问题之后发挥的想象力。也许原本没有这样的内容，但是经过想象，你可以用另一种内容替换。大胆想象，充分验证，是用好 CSS 的关键。

## 垂直居中
垂直居中的情况比较复杂。如果需要居中的内容确定只有一行，可将容器元素设置为具有相同值的 `padding-top` 与 `padding-bottom`，或者设置相同值的 `height` 与 `line-height`。

如果需要居中的内容有多行，从 `text-align：center` 来说，自然而然会想到 `vertical-align: middle`。很美好的想法，但是有些问题。此属性用来指定行内元素（inline）或者表格单元格（tabel-cell）元素的垂直对齐方式。行内元素内容的对齐是相对于父元素的基线来说的，取值为 `middle` 并不是我们想要的几何上的垂直居中。想要实现几何上的垂直居中，需要将容器元素模拟为表格单元格元素 `display: tabel-cell`。

另一种方法是使用伪元素 `::before` 与 `::after`。将伪元素的 `content` 为空值，我们只需要伪元素在高度上撑开父元素（`height:100%`），然后伪元素与容器元素在显示为行内块元素的情况下同时应用 `vertical-align: middle`。

## 水平与垂直同时居中
如果子元素的大小已知，那么就很简单了，使用等于子元素宽度和高度的一半的负边距，在将其绝对定位在 `top: 50%; left: 50%;` 之后将使子元素水平与垂直居中。如果子元素的大小未知，我们可以在两个方向上使用 transform 属性和 50％ 的负向平移（它基于元素的当前宽度/高度）来居中子元素 ` transform: translate(-50%, -50%);`。

## 推荐方法
上面总结到的方法只是很简单的几种。在 CSS 居中的道路上，绞尽脑汁的前辈们给我们留下了各式各样的攻略，详情可以求助于搜索引擎。到今天，**如果对兼容性没有太高要求，推荐使用 Flexbox 方便快捷地解决这些问题**。Flexbox 布局可以使内部元素按需要伸缩，设定元素在主轴与交叉轴上同时居中，即可快速实现水平与垂直居中的效果。
```CSS
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

另外，较新的 Chrome 浏览器已经开始支持 `display: grid` 网格布局模型。如果你正在使用新版本的 Chrome 浏览器，可以尝试如下代码实现水平垂直居中。
```CSS
.parent {
  display: grid;
}

.child {
  margin: auto;
}
```

## 总结
结合 CSS-Tricks 中的[这篇文章](https://css-tricks.com/centering-css-complete-guide/)，参照 [JavaScript Array Explorer](https://github.com/sdras/array-explorer) 的实现方式，我用 React 构建了[CSS Centering Explorer](https://github.com/chunqiuyiyu/css-centering-explorer)。此项目仅仅用来参考使用，真正理解 CSS 居中，还需求大量的练习与实践经验。