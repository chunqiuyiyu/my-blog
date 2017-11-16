---
title: HTML5 模板标签的使用（下篇）
date: 2015-12-09 14:34
tags: [HTML5, JavaScript, 模板]
---

上篇说到，如果动态添加的 HTML 代码节点比较复杂，并且同时含有`<script>`和`<textarea>`标签，使用相同的标签包裹在外面就会出现匹配错误，那么就轮到一个新的标签出场了，没错，就是 HTML5 引入的新标签`<template>`。

## 语义化标签使用
看看名字就知道，这个标签是专门用来解决 html 模板问题的，`<textarea>`和`<script>`终于可以歇歇了（其实并不能，注意兼容性问题，我使用的是最新的 Chrome 浏览器）。这个标签的使用方法与`<script>`等有一些不同。我们把 HTML 模板文件包含在这个标签里面，用`content`属性获得标签中的内容，并输出。

```JavaScript
var template = document.getElementById('htmlString').content;
console.log(template);
```

![document-fragment.png][1]

你会发现它是一个`document-fragment`，称为“文档片段”，这个文档片段提供了很多 API 可以供我们使用，也就是说动态改变内容可以不使用字符串替换来完成。比如说来修改`<em>`标签中的内容，我们可以先查询到这个元素，并修改内容，这比繁琐地用字符串查找方便得多（复杂情况下字符串替换可能需要用到正则表达式）。

```JavaScript
var em = template.querySelector('em');
em.innerText = "我是新的 em 元素";
```

当我们修改好模板内容后，我们就要“激活”模板，将其添加到页面中，让浏览器渲染它，显示在我们面前。直接写入肯定是不行的，因为`content`是一个文档片段，并非字符串，这里要用到`document.importNode()`方法复制文档片段到新建节点中，然后插入文档，注意方法的第二个参数为`true`，进行深度复制（遍历复制所有的子孙节点）。

```JavaScript
var clone = document.importNode(template, true);
document.body.appendChild(clone);
```

使用`<template>`标签有如下的特点：
1. 模板内容并不会显示，默认是隐藏的，直到你“激活”模板（添加到页面文档中）；
2. 模板中的标签不会产生渲染效果，例如脚本不会运行，图片不会被加载，音频不会被播放等，直到你“激活”模板；
3. 模板内容不在页面的文档流中，在主页面文档使用中使用`gerElementById`或者`querySelector`来获取模板内容的节点是不可行的；
4. 模板的位置比较随意，你可以放在`<body>`、`<head>`、`<frameset>`，甚至是`<table>`或者`<select>`中。

你可能会问，如果 HTML 代码中有`<template>`标签怎么办？完全不用担心，嵌套的`<template>`会被正确处理，想让内部`<template>`标签被正确渲染，只需要“激活”内部模板即可，也就是说，嵌套模板中，激活外层模板并不能同时激活内部的模板。比如你的模板文件是这样：

```HTML
<template id="htmlString">
    <div>我是最外面的 div 
        <p>我是第一个 p 元素<em>
            我是 p 元素里面的 em 元素
        </em></p>
        <p>我是第二个 p 元素</p>
        <template>
            <p>我是嵌套模板里面的 p 元素</p>
        </template>
    </div>
</template>
```

那么要想显示里面`<template>`标签的内容，你需要两次的文档复制并插入（注意第二次的插入时节点的位置）。

```JavaScript
var template = document.getElementById('htmlString').content;
var clone = document.importNode(template, true);
document.body.appendChild(clone);

var inner = template.querySelector('template').content;
clone = document.importNode(inner,true);
document.querySelectorAll('p')[1].appendChild(clone);
```
其实，嵌套`<template>`并没有多少实际意义，也就是举个例子而已。

## 结束语
在前端的领域，兼容性始终是一个巨大的坑，怎么绕都绕不过去，只能是且行且珍惜，掉到坑里的时候不仅仅要想怎么爬出来，更重要的是想想为什么会掉进来，醉乡路稳宜频到，此外不堪行。


  [1]: /img/document-fragment.png