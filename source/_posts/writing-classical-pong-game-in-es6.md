---
title: ES6 开发经典 Pong 游戏
date: 2017-04-01 23:25
tags: [游戏, 2D, JavaScript, HTML5]
---
## 前言
随着es6标准的正式成立，JavaScript的光芒越来越显眼。在当前web应用复杂化、多样化、跨平台化的背景下，JavaScript本身的弱点被无限放大，前端有很多的轮子正是为了解决JavaScript本身的问题。我很佩服过去那些前辈们卓越的智慧，戴着枷锁跳舞，运用各种技巧规避JavaScript的缺点，榨干JavaScript的性能，构建出如此多彩的web时代。但是，到了现在，我们终于可以用一种更加规范化、可接受的思路与语法开发web应用了。


<!--more-->


此篇文章梳理了用es6语法开发经典的Pong游戏的技术要点。整个游戏其实挺简单，左边是玩家控制的挡板，右边是电脑控制的挡板。一个小球在场景内弹来弹去，两边挡板将小球接住并弹到对方区域中，以此往复。直到一方没有接到小球，那么没接到球的一方输掉一局，然后游戏重新开始。此游戏使用到的es6语法在最新主流浏览器（chrome、firefox、edge）中已经原生支持，如果要运行在兼容性差的浏览器中，请使用转换工具将其转化成es5的代码，推荐使用[babel][1]。

## es6要点
- 使用es6中的class\constructor\extends\get\set实现面向对象。要注意的是，虽然用到了`class`关键字，实际上只是语法糖。它提供了一种类似传统面向对象语言的方式来定义类，本质上还是基于原型对象。说实话，个人觉得原来使用原型对象实现的面向对象方式很怪异，现在这样，代码清晰多了。`constructor`是构造函数，此方法默认返回实例对象，如果要使用父类的方法，必须在构造函数中调用`super`方法。`extends`实现继承，这个关键字不但可以用来继承类，还可以用来继承JavaScript的原生对象结构（如Array、Number等）。`get`与`set`是属性赋值器与取值器，提供了一种快捷的方式对类中的属性进行读取与修改。
- 箭头函数，或者更被熟知的叫法：lambda表达式。用`=>`生成匿名函数，形式为`()=>{}`，左边的圆括号中写入函数的参数（如果只有一个参数可以略去圆括号），右边的花括号中写入函数体，这样的写法简洁明了，在回调函数中大量使用，用来代替传统的`function(){}`。
- const与let关键字，`const`用来声明一个常量，`let`用来声明一个块作用域中的变量。在以前的JavaScript中，只有函数作用域，因此引发这种稀奇古怪的问题，在使用`let`关键字后，变量生效的范围明确下来，减少了出错的概率。

## 其他要点
- canvas就不多说了，这是整个游戏绘制的地方。有一点就是当游戏页面放大或者缩小的时候，要使用一个缩放比例保证玩家控制的挡板能够响应到正确的鼠标位置，如下：
```JavaScript
canvas.addEventListener('mousemove', event => {
    // when canvas is resized, build the relationship to event responce
    const scaler = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scaler;
});
```
- 整个游戏并没有使用到任何图片素材，分数的显示也是由canvas完成的。实现的方法类似于字符点阵，规定一位数字（0~9之一）显示在3x5的格子中，绘制的地方用1表示，不绘制的地方用0表示，然后用一串字符串表示这个数字，比如说数字5的表示方法如下：

![number.jpg][2]

- `display:flex`的使用，这是一个比较新的css3布局属性，叫做弹性布局。使用这个属性，可以让一个元素及其中的子元素保持灵活性，当页面大小绽放时，弹性布局的元素保持基本的相对位置。使用此布局时，子元素的垂直居中非常容易实现，只需一个css属性即可：`align-items: center;`。在我使用这个属性的时候，发现了一个chrome的渲染bug，就是在给`display`属性为`flex`的元素添加`border`时，使用合写的方式（类似`border:2px solid #fff`）会导致下边框无法渲染，采用分写的方式就不会出现这种情况。测试的chrome版本是当前最新的稳定版：57.0.2987.133。
- 文档声明的必要性。我以前写html文件时，常常为了图方便而忽视文档声明，想起来时就加上，忘记了就不加。其实这是一种相当不好的习惯，虽然在大多情况下，浏览器会帮我们纠正这个问题，正确解析出文档内容。但毕竟它只是个程序，我们最好指定当前文档的解析方式，这样可以避免很多页面解析渲染可能出现的问题。最新的标准是html5，一定要在每一个html文件的第一行加入正确的文档声明：`<!DOCTYPE html>`。
- `requestAnimationFrame`的使用，别被它长长的名字吓倒，它只不过是一个增强版的`setTimeout`，它的出现是为了优化动画效果的，在使用canvas或者JavaScript动画时，推荐使用它替代原来的`setTimeout`或`setInterval`。浏览器对专门针对此api进行优化，合理地重新排列动画序列，并把能够合并的动画帧放在一个渲染周期内完成，从而呈现出更流畅的动画效果。唯一要担心的是兼容性问题，这是一个较新的api，在旧浏览器上使用时，添加一层shim：判断`window`对象中是否有这个方法，如果没有，回退使用`setTimeout`或`setInterval`。

## 效果展示

![pong.jpg][3]

## 链接

[源码][4]
[效果演示][5]

## 后记
《周易》中说“穷则变，变则通，通则久”。现在也是JavaScript需要变化的时候了，作为一名靠这门语言吃饭的人来说，及时地拥抱这种变化，并将其正确地应用到合适的地方，才是长久之道。


  [1]: http://babeljs.io/
  [2]: /img/number.jpg
  [3]: /img/pong.jpg
  [4]: https://github.com/chunqiuyiyu/learn-javascript/tree/master/pong
  [5]: http://www.chunqiuyiyu.com/usr/uploads/demos/pong/index.html
