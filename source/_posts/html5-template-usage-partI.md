---
title: HTML5 模板标签的使用（上篇）
date: 2015-12-09 09:21
tags: [HTML5, JavaScript, 模板]
---

## 前言
有些时候，我们需要用 JavaScript 向页面动态地添加一些 HTML 代码，虽然这看起来十分不好（破坏了 HTML 文件和 JavaScript 文件的独立性，结构与逻辑夹杂在一起，导致代码难读难懂），但是，这确确实实是一种常见的需求（需求什么的，最坑爹了）。这个时候，我们会有如下的几种方法来实现。

## 直接写入
如果 html 代码较短，那没什么可说的，js 本身就提供了相关的方法让我们动态更改 html 内容。
* `document.write()`方法
* `DOM.innerHTML`属性
* `document.createElement()`创建元素节点、`appendChild()`插入元素节点等

以上方法简单粗暴，十分方便，但是仅仅适用于一些有限的场合（节点个数少，结构简单）。如果要生成一个节点结构比较复杂的 DOM 树，就会出现问题。比如我们要生成如下的 html 代码：

```HTML
<div>我是最外面的 div
    <p>我是第一个 p 元素<i>
	我是 p 元素里面的 i 元素
</i></p>
<p>我是第二个 p 元素</p>
</div>
```

这样的话，动态创建节点的`createElement()`方法能把你累死。同时 html 字符串就会很长、很长。`ineerHTML`属性赋值会变成这样：

```HTML
document.body.innerHTML = '\
<div>我是最外面的 div \
	<p>我是第一个 p 元素<em> \
		我是 p 元素里面的 em 元素 \
	</em></p> \
	<p>我是第二个 p 元素</p> \
</div>';
```
不忍直视，这还只是几个元素而已，如果再多，直接写入的方法就是恶梦了。

## 模板标签
不管怎么样，问题还是要解决的，聪明的人们想出了一招曲线救国的方法。先把 HTML 代码放在一个`<textarea>`标签中，将其 CSS 设为`display:none`，这样的话，浏览器加载页面时不会对`<textarea>`标签内的东西进行渲染，我们需要的时候直接读取里面的内容，然后直接写入到页面上。

```HTML
<textarea id="htmlString" style="display:none">
<div>我是最外面的 div 
	<p>我是第一个 p 元素<em>
		我是 p 元素里面的 em 元素
	</em></p>
	<p>我是第二个 p 元素</p>
</div>
</textarea>
<script> 
	var template = document.getElementById('htmlString').value;
	document.body.innerHTML = template;
</script>
```

这样一来，问题迎刃而解。而且`<textarea>`标签里可以无限容纳无限长的文本（理论上），想怎么写就怎么写，神清气爽，有木有？如果需要动态改变其中的内容，进行字符串替换即可。比如说我想把第一个`<p>`元素里的文本修改一下，可以这样做：

```JavaScript
template =template.replace("我是第一个 p 元素","我是新的 p 元素");
```

但是，有一个问题：如果你的 HTML 代码中本身就有`<textarea>`标签，这个方法就行不通了。浏览器无法正确识别最外层的`<textarea>`标签与里面包含的`<textarea>`标签嵌套情况，导致匹配错乱，我们无法得到正确的 HTML 代码。那么这个问题有没有方法解决呢？有，当然有！我们可以换一个标签（重复代码不再写出）:

```HTML
<script type="text/template" id="htmlString"></script>
var template = document.getElementById('htmlString').text;
```

使用`<script>`标签不需要设置样式为隐藏，`type="text/template"`起到了类似作用。看到这里，聪明的你肯定想问了，如果我的 HTML 代码里面有`<script>`标签怎么办？问到点子上了，同样的，这样也会有标签匹配的问题，解决方法是标签换着用:用`<textarea>`标签包裹含有`<script>`标签的 HTML 代码，用`<script>`标签包裹含有`<textarea>`标签的 HTML 代码，那么你肯定又想问，如果代码里面既有`<textarea>`标签又有`<script>`标签怎么办？算你狠，我们还有第三种，也是本文推荐的方法。篇幅太长，第三种方法在下篇中详细介绍，上篇就到此为止。