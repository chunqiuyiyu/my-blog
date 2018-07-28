---
title: UGUI 制作文本列表
date: 2015-04-22 11:09
tags: [Unity, UI]
---
## 前言

好久都不写文章了，关键是这几天感觉很累。其实每天也没有多少事，可能是状态不好吧，老是感觉到疲倦。今天状态还算好，就琢磨着写点东西。UGUI 是 unity gui 的简称，这是 unity 4.6 以后的版本中自带的 gui 系统，用来制作用户交互界面的。相比于老牌的 NGUI 插件，UGUI 是正统出身，可能不够成熟，但是确实上手简单，在自适应方面很是不错，想必会后来居上，得到大家的认可。


<!--more-->


下面是有人做出的一张 UGUI 与 NGUI 的特点对比图，大家可以看看。

![对比 - 1024x581.png][1]

随着 unity 5 的发布，UGUI 也是更加完善，修改了很多不足的地方。今天就来看看如何用 UGUI 制作一个文本列表吧，这个在实际的游戏开发中可以做成游戏的公告板什么的。

## 对象布局

我的例子中，各个游戏对象在层次面板中的布局如下：

![12.png][2]

其中，Main Camera 是新建场景时的自带主摄像机，不必多说。Canvas 和 Event System 是 UGUI 创建界面时自己生成的，是界面绘制的基础，用作界面元素的容器和处理用户的交互响应。其余的游戏对象是我们自己新建的。我们来一一说明。

* Note，本质上是界面元素中的图片，我们用它来做整个文本列表的背景，我们将它的透明度调整下，使它看起来灰一些。

* Title，本质上也是一张图片，用来做文本列表的标题背景，它下面还有一个子物体，是一个文本控件，也就是本例中的 “公告” 二字。

* TextBg，图片控件，是文本列表的背景，颜色是白色，看起来能够突出一些。它有一个子物体，也就是我们要显示的文本内容，我选择了一首自己很喜欢的诗歌《世界上最遥远的距离》。这个子物体和 TextBg 的要保持宽度一致，但高度要高于 TextBg，保证我们的大段文本显示完全。在 TextBg 上面添加了一个 Scroll Rect 组件，正是这个组件，实现上整个文本列表的滚动，关于这个组件的详细设置，大家可以自己试试，就很容易理解了。第一个选项就是要滚动的内容，我们让它滚动文本，将 TextBg 下的子物体 text 放入，方向勾选垂直滚动，也就是上下滚动，这个大家可以根据实际需要进行选择。在 Vertical Scrollbar 选项中拖入我们自己的 Scrollbar。然后添加一个 Mask 组件，让文本背景遮住大段超出 TextBg 的文本，Mask 组件只有一个勾选按钮，用来控制是否显示遮罩的图片，可根据实际情况进入勾选。这样，整个文本列表的主体就完成了。
![31.png][3]
* Scrollbar，用来和 TextBg 上的 Scroll Rect 进行配合，上下滑动控制文本列表显示完全。主要调置是滚动条的方向。在这里，我们选择 Bottom to top。
![4.png][4]

最后，完成的情况如下所示，为了看起来更加清晰，我们将各个部分用不同的颜色框划分出来。

![22.png][5]

## 效果演示

![note.gif][6]

## 结束语

确实，随着 unity 引擎的不断发展完善，要学习的东西也是越来越多，也许会感觉很累。但是，乐趣和挑战也是不断升级，所以，自己会记录下学习中的每一步，以此来鞭策自己，继续努力，不教一日闲过。


  [1]: /img/2871325767.png
  [2]: /img/3403679236.png
  [3]: /img/2832224603.png
  [4]: /img/3644178143.png
  [5]: /img/2355570922.png
  [6]: /img/3058179474.gif