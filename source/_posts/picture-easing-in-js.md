---
title: JS 快速实现图片缓动
date: 2015-08-20 15:27
tags: [HTML5, JavaScript]
---

## 前言
在自己开发一个项目的过程中，需要用 HTML5 + JS 实现一个图片左右缓动的效果。找了很多的方法来实现，比如找个现成的 JS 库或者 CSS 的动画库，等等。但是效果都不能尽如人意。于是自己想到如此细小的功能如果还要使用大型的框架来解决，那岂不是杀鸡用牛刀吗？索性自己用 JS 来实现，为了以后能够多次复用，特此记录。其实一个好的习惯是多多用自己的脑子想想，如果老是寄希望于框架或者库来解决问题，也就彻彻底底沦为代码民工了吧。


## 主要代码
```js
var img = document.getElementById(“img”);
var radian = 0;
//use radian to control move speed 
var perRadian = 0.02;
var oldX = 100;
//floating radius
var radius = 10;
function update() {
  radian += perRadian;
  var dx = Math.cos(radian)*radius;
  //update position
  img.style.left = (oldX + dx) + “px”;
}

setInterval(update, 60/1000);
```

## 说明
代码是写直接写在 HTML 文件中的，关键地方都使用了注释（不要吐槽蹩脚的英语，中文注释在脚本中会出现各种各样的问题，以后会努力使用英文注释），主要的思想就是三角函数的应用。还记得以前数学课上学过的三角函数吗？就是这个知识点。

再回想一下坐标系，我们让一个圆的半径绕着圆心转动（圆心位于坐标系原点），然后算出转动过程中半径在 x 轴上的投影，这个投影的最大值就是半径 radius，最小值就是负的半径 -radius。所以说代码中的 radius 控制图片左右移动的范围。

代码中的 perRadian 是指半径绕动的速度，要知道投影是实时获取的，所以 perRadian 控制图片左右移动的速度。要注意的是，整个缓动过程是匀速的，也就是说运动曲线是线性的。如果你寻找更加复杂的运动效果，本文方法并不适用。

## 后记
不写实际的代码根本不知里面的坑有多深。有些时间需要更多的思考以及反思，心急吃不了热豆腐，这是个真理。
