---
title: unity 实战之 StreetRacer
date: 2016-10-15 00:02
tags: [Unity, 游戏, C-Sharp, 2D, UI]
---
## 说明
这是我自学unity开发出来的赛车游戏Demo。关键的几个点，比如说车的移动，障碍物的生成，以及车的控制都已经完成。值得一提的是，此游戏的开始界面是自己在inkscape软件中绘制的，感觉还不错。开发游戏嘛，总依赖于网上的免费资源也不好，毕竟要形成自己的风格，虽然刚开始可能会差一些，但总得有起步的时候，慢慢来吧。


<!--more-->


## 流程梳理
unity游戏是基于组件的开发游戏。更多的操作以及重心应该在于编辑界面的操作，具体操作以文字形式实不好说明，但是梳理一些开发游戏及知识点是很重要的，毕竟自己才刚刚入门。

整个赛车游戏的界面是采取竖屏滚动的方式，这是赛车游戏的核心识别要素之一。这个功能的实现，就有很多实现思路。此游戏采用让跑道纹理循环滚动的方式来凸显出车子的移动。在游戏中，车的位置没有变过，跑道的位置也没有变过，就是车和跑道接触的地面纹理不停向下移动，给人的错觉就是车子在向前跑，典型的参照物模型。还有的做法是准备两个跑道的面片，将它们竖着拼接在一起，然后同时以相同的速率向下移动这两个面片，当其中一个面片完全移出视野后，将其移动到当前视野面片的上方。以此循环往复，实现功能。这个方法对于无限滚动的模屏游戏同样适用。
```
void Update () {
    offset = new Vector2(0, Time.time * speed);
    GetComponent<Renderer>().material.mainTextureOffset = offset;
}
```
还有要说明的是车子的控制方式。使用了条件编译指令区分不同的平台，当此游戏编译运行的平台是PC时，采用默认的键盘控制（WSAD和箭头键），当游戏编译运行的平台是android时，分别实现了触屏控制与重力感应的控制（最终展现效果是重力感应控制，触屏控制当作学习试验）。
```
\\触屏控制
void TouchMove(){
    if(Input.touchCount > 0){
        Touch touch = Input.GetTouch(0);
        float mid = Screen.width / 2;
        if(touch.position.x < mid && touch.phase == TouchPhase.Began){
            MoveLeft();
        }else if(touch.position.x > mid && touch.phase == TouchPhase.Began){
            MoveRight();
        }
    }else{
            StayZero();
    }
}
\\重力感应
void AcceleMove(){
    float tmp = Input.acceleration.x;
    if(tmp < -0.1f){
        MoveLeft();
    }else if(tmp > 0.1f){
        MoveRight();
    }else{
        StayZero();
    }
}
```
类比来看，这两种控制方式的实现都是类似的，调用的三个控制函数是让车子向左移动`MoveLeft()`、向右移动`MoveRight()`和保持原位`StayZero`的。这三个函数内部实现大同小异，就是给车子上的刚体组件添加不同大小、方向的加速度罢了。

其他的代码逻辑比如障碍车辆的生成与出界销毁，还有声音及界面按钮的处理等等比较简单，和以前的游戏类似，就不再细说了。
## 游戏界面
![street-racer.png][1]

## 链接
[GitHub][2]
[源码][3]
[APK程序][4]


  [1]: /img/street-racer.png
  [2]: https://github.com/chunqiuyiyu/unity-games/tree/master/StreetRacer
  [3]: http://www.chunqiuyiyu.com/usr/uploads/2016/10/2771199280.unitypackage
  [4]: http://pan.baidu.com/s/1i5jqS3V



