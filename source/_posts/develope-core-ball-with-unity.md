---
title: Unity 实战之 CoreBall
date: 2017-02-07 15:22
tags: [Unity, 游戏, C-Sharp, 2D]
---
## 题外话
话说自己现在是越来越懒了，当初搭建博客时的雄心壮志早已被抛到九霄云外去了。刚开始的时候，恨不得每天写出好几篇文章来充实自己的博客，而实际情况却是动笔（或者说动手？）次数逐渐减少，从以前的一月几篇到现在的几月一篇文章。这其中当然有客观原因：技术的沉淀是需要时间，入门时会运行一个简简单单的示例代码都会让自己兴奋不已，有种想要写出来分享的冲动，现在却不合适了。到现在的程度（虽然仍在初级阶段），更多地，自己会从整体的方面亦或者说是架构层次上寻找启发点。当然了，写的东西依旧浅薄，只能是坐井观天而已。


<!--more-->


## 游戏概述
这次实现的是一个小游戏 CoreBall 的原型 Demo，中文译作“见缝插针”，这个译名相当合适。因为游戏的玩法就是将下方的一个个小球插到屏幕中不停旋转的大球上，随着小球的不停插入，大球上余下的空间会越来越少，以此考验玩家的眼力和敏捷度。直到所有的小球全部插入到大球上，然后进入下一关，每关的小球数量、大球的旋转速度、方向都不一样。如果插入小球的时候不小心碰到了大球上已经插入的小球，那么本关挑战失败，游戏会重新开始。

## 思路梳理
技术方面主要用到的组件是线条渲染器。从游戏效果来说，已经完成了所有的功能。作为游戏原型来说，已经可以了，但是要想正式发布成为产品，还需要打磨很多地方。

该游戏只有一个游戏主场景，里面的物体不多。

![scene.png][1]

其中摄像机被重命名为 Eye，并在上面挂载有音乐监听器及播放音乐的相关代码。
```cs
void Start () {
    audioSource = transform.GetComponent<AudioSource> ();   
}

public void hitAudioPlay(){
    audioSource.clip = hitAudio;
    audioSource.Play ();
}
```
Core 游戏对象值得重点关注，它是游戏各个关卡的挂载点，当游戏开始时，从用户数据中读取出当前的关卡数，如果是第一次玩，那么就将当前游戏的关卡数置为1，然后将当前关卡数显示在 Core 对象上，接着从预置关卡数组中读取第一关的预置体，将其父对象设置为 Core 游戏对象。
```cs
//generate the levels
GameObject.Find("TCore").GetComponent<Text>().text = level.ToString();
GameObject levelGameobjct = Instantiate(levels[level-1]) as GameObject;
levelGameobjct.transform.parent = GameObject.Find ("Core").transform;
```
Cor 对象上几乎挂载有所有的主要游戏脚本，如控制旋转方向与速度等等。此时大球就会带着原先设计好的关卡小球一起旋转，本原型只做了三关，如果要进行关卡数目的扩展，就要发挥想象力来增加趣味性了。

![level3.jpg][2]

最后值得说明的说是 B0 ~ B3 这三个小球,它们位于游戏场景的下方正中,作为样式来指示还剩余多少个小球。每次点击屏幕，一个预置小球就会从三小球的顶部生成。预置小球本身带有向上运动的脚本，向上到达一定范围（也就是外围小球的运行轨道外）停止，然后播放插入音效，并从大球圆心处渲染出一条细线到达自身的圆心处，给玩家的感觉就是小球插到了大球上。
```cs
void Update () {
    if (stateSwitcher) {
    transform.Translate (0, upVelocity * Time.deltaTime, 0);
    //the critical point
    if (transform.position.y >= -2.5f) {
        //stop the ball and set its parent: the core ball
        transform.position = new Vector3 (0, -2.5f, 0);
        transform.parent = core.transform;
        GameObject.Find ("Eye").GetComponent<AudioManager> ().hitAudioPlay ();
        stateSwitcher = false;
    }
    } else {
    //when the ball is stopped,draw the line to core
    line.SetPosition (1, transform.position);
    }
}
```
当小球成功插入到大球上时，从上到下依次将三小球上的数目减一，以此循环，如果小球上的数目减为零或者负数，将数目为零或者负数的小球设为隐藏，给玩家的感觉就是小球已经全部插入到大球上。等待 1.5 秒后，将关卡数加一，然后重新加载当前关卡。

**特别要注意的是自从 Unity 5.3以后，场景加载需要引用新的命名空间，这算是一个比较重大的 API 变化了。**
```cs
using UnityEngine.SceneManagement;
...
SceneManager.LoadScene (0);
```
其他诸如小球的碰撞，关卡数据的存储等等，和以往代码十分雷同，就不多说了。

## 最终效果

![coreball.jpg][3]

## 链接

[源码][4]
[GitHub][5]
[APK程序][6]

## 思考
随着越来越多游戏引擎的开源免费，游戏开发者的选择面也越来越宽，因此很多初学者总会在选择引擎时踌躇不决，然而我觉得，选择一个引擎，然后坚持学习下去，比比较各大引擎优劣而浪费时间精力更有意义。



  [1]: /img/scene.png
  [2]: /img/level3.jpg
  [3]: /img/coreball.jpg
  [4]: http://www.chunqiuyiyu.com/usr/uploads/2017/02/2462223575.unitypackage
  [5]: https://github.com/chunqiuyiyu/unity-games/tree/master/CoreBall
  [6]: https://pan.baidu.com/s/1jILUVrw



