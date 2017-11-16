---
title: 学习 Web Components
date: 2017-11-13 16:10
tags: [Web, 组件, HTML5]
---
## 前言
Web Components 是构建 Web 应用中独立组件的 W3C 规范。在软件开发的领域，有一个 DRY （Don't repeat yourself）原则，Web Components 的提出，正是为了可靠地进行复用 Web 页面上的部件。虽然这个标准很新，到目前为止，只有 Chrome 较新的版本才实现，但事实上，随着 React 等框架的广泛应用，模块化与组件化的开发思想早已深入人心。

## Web Components 结构
Web Components 规范当前由四部分组成：template、HTML Imports、Shadow DOM 和 custom elements。使用 Web Components 的时候，并不要求包含所有的部分，而是依据所需合理搭配使用。

### template
模板元素`<template>`包含可以多次使用的 HTML 结构，样式和脚本，虽然这个标签比较新颖，但是对于 Web 开发人员来说，模板化过程并不新鲜。在以前，开发人员运用各种方法（通过隐藏的`<textarea>`或者指定特殊类型的`<script>`标签）向页面中填入大段的 HTML 结构。到浏览器普遍支持的时候，`<template>`将会终结各种奇技淫巧，成为真正的模板化规范。有关模板元素的使用，以前有文章[这里](/2015/12/html5-template-usage-partI.html)还有[这里](/2015/12/html5-template-usage-partII.html)详细探讨过，这里就不再赘述。

### HTML Imports
HTML 导入提供了一种功能，将外部的 HTML 文档导入到当前的 HTML 页面中。你也许会想到`<iframe>`标签，但是`<iframe>`是用来嵌入内联框架的，对于导入 Web 组件来说太“重”了。HTML 导入使用`<link>`标签，指定`rel`为`import`，`href`为 HTML 的 URL。
```HTML
<link rel="import" href="message.html">
```
与 CSS 不同，导入 HTML 后需要使用 JavaScript 获取到所需的元素，插入到当前的文档树才会在页面上渲染。
```JavaScript
const externalDocument = document.querySelector('link[rel="import"]').import;
const headerElement = externalDocument.querySelector('h1')
document.body.appendChild(headerElement.cloneNode(true));
```

### Shadow DOM
Shadow DOM 是 Web Components 能够存在的基石。它将 Web 组件中的 HTML、JavaScript 与 CSS 封装起来，避免外界因素的干扰。为了更好地开发与调试，可以在 Chrome 的开发者工具中打开相关选项检视 Shadow DOM。
![shadow-dom-debug-options.png](/img/shadow-dom-debug-options.png)
Shadow DOM 也是一个 DOM 树结构，隐藏在真正的 DOM 后面，默认的样式设定与 DOM 查询并不会对 Shadow DOM 中的子节点起作用，Shadow DOM 中的子节点聚集在一个根节点（Shadow Root）下，然后挂载到一个真正的 DOM 节点（Shadow Host）上才会渲染到页面中。Shadow DOM 通常结合 template 使用，十分方便。
```JavaScript
const template = document.querySelector('template');
const root = document.querySelector('#host').createShadowRoot();
root.appendChild(template.content);
```
上面已经说过 Shadow DOM 为 Web 组件提供了封装，所以默认情况下，外界样式与组件内部样式不会相互影响。但有，Web 组件并不是自闭的，我们希望有些情况下，外部文档与组件内部之间可以交互。这时，组件内部可以使用`:host`伪类影响 Shadow Host 的样式，外部文档可以使用`::shadow`伪元素影响 Shadow Root 内的子节点的样式。但是一般而言，不要随意破坏 Web Components 的封装性。
```CSS
:host {
    border: 1px solid red;
}

#host::shadow p {
    color: blue;
}
```

### custom elements
自定义标签可以让开发人员构建新的 HTML 标签或者对原有的标签进行扩展，丰富了页面的语义性。如果碰到一组有联系的标签，就可以抽象成一个自定义标签，然后在其他页面使用。为了使浏览器识别和支持自定义标签，首先需要在浏览器中注册自定义标签。
```JavaScript
document.registerElement('product-listing', {
    prototype: Object.create(HTMLTableElement.prototype),
    extends: 'table'
});
```
注册通过`document.registerElement`完成，此方法第一个参数是自定义标签的名称，根据 W3C 规范，名称全部应该小写，并包含一个破折号（-），防止与原生标签发生冲突。浏览器也可通过标签名称区分原生标签与自定义标签。第二个参数是一个选项对象，声明自定义标签继承的原型，默认的原型是`HTMLElement.prototype`，修改此对象的`prototype`与`extends`属性就可以对原生标签与自定义标签进行扩展。上面示例中的`<product-listing>`标签就是扩展自原生的`<table>`标签。注册自定义标签后，它就可以像原生标签一样被使用了。
```JavaScript
// create an instance of the product-listing custom element
var productListingEl = document.createElement('product-listing');
// append it to the DOM
document.body.appendChild(productListingEl);
```
我们还可以在自定义标签继承的原型上添加属性来方法来扩展自定义标签的功能。有些特殊的方法已经被预先定义，如`createdCallback`、`attachedCallback`、`detachedCallback`、`attaributeChanged`等。从名字上就可以知道，这些方法正是自定义标签的在不同生命周期阶段时的回调方法。灵活地使用这些回调方法，自定义标签的功能会更加强大。

## 后记
上面说到的只不过是 Web Components 的皮毛而已。然而令人遗憾的是，Web Components 看起来很美好，功能很强大，在目前看来，却是一门屠龙之技。没有浏览器的支持，再好的规范或者标准也只能停留在纸上。如同原生`querySelector`在“jQuery时代”的处境一样，现在的 React 等框架也让 Web Components 的地位十分尴尬。不过就学习而言，Web Components 可以让我们更加深刻地理解组件化的思想，这就足够了。
