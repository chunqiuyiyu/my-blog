---
title: 用 phaser 开发 2D 平台游戏
date: 2016-05-28 18:10
tags: [游戏, 2D, HTML5, JavaScript, Phaser]
---
## 前言
phaser 是一个非常好用的 html5 游戏开发框架，官网上是这样介绍的：“一个快速、免费并且完全开源的框架，提供 Canvas 和 WebGL 两种渲染方式，致力于增强桌面端与移动端浏览器游戏的体验”。使用的过程中，个人确实感觉它的方便与易用性，能够快速实现自己的游戏想法。


<!--more-->


![phaser.png][1]

## 目标
为了学习 phaser 框架，开发了一款简单的平台跳跃游戏。学习了如何在 phaser 中使用场景（State）, 精灵（Sprite）, 游戏输入（Input）以及碰撞检测，算是简单的入门而已。这个框架还有更多精彩出众的地方，等着我去发掘。主要的学习手段是参阅框架 API 文档，不得不说 phaser 的 API 文档写得很赞，结构清晰，内容完整准确，让初学者能够快速上手。

![platformer.png][2]

## 开始
一切的一切，从一个 platformer 目录开始。platformer 目录包含一个 index.html 入口文件以及 img 和 js 文件夹。html 文件很简单，只是标准的 html5 文件结构，里面引用了 js 文件夹中 phaser.min.js 游戏框架文件和 main.js 游戏逻辑文件。**需要注意的是在 html 文件中要注意 js 的引用的顺序，main.js 会使用 phaser.min.js 提供的 Phaser 全局变量，所以要先引用 phaser.min.js 文件，接着引用 main.js 文件，否则会报错 **。img 文件中是游戏的资源文件，一张白色的方块图片，在游戏中会被渲染成不同的颜色，表示不同的游戏对象。

## 构建游戏世界
html5 游戏，世界都构建在 `<canvas>` 标签上面。首先来构建当前的游戏世界，并直接进入主要场景（Main State）。游戏很简单，所以只有一个主场景，如果开发复杂一些的游戏，就要考虑到场景的管理与切换了（从开始场景到游戏场景再到结束场景等等）。
```js
var game = new Phaser.Game(600, 250 , Phaser.AUTO,"");
var main = new Phaser.State();
game.state.add('Main', main);
game.state.start('Main');
```
`Phaser.Game` 用来构建游戏世界，接受的参数依次是游戏世界的宽、高、渲染模式和 `<canvas>` 标签的 id 属性，本游戏渲染模式使用 `Phaser.AUTO`，也就是自动检测，在浏览器支持 WebGL 的时候使用 WebGL 渲染，不支持的时候回退到 Canvas 渲染。id 参数传入 `""` 是让框架在 `<body>` 中生成 `<canvas>` 标签。如果需要在特定的 `<div>` 标签内生成，首先应该在 html 文件中添加带 id 属性的 `<div>` 标签，然后传入 id 属性即可。`Phaser.Game` 返回一个游戏对象，这是整个游戏的核心，通过这个游戏对象（用全局变量 `game` 引用），就可以快速使用 phaser 提供的各种方法来开发 html5 游戏了。
`Phaser.State` 用来创建游戏场景。从名称上来说 state 应该译为状态，但我觉得称为场景更加妥当。因为 Phaser.State 中提供的各个方法搭起了一个脚手架，用来展现当前游戏画面。本游戏用到了 `init` 方法，`preload` 方法，`create` 方法和 `update` 方法，分别管理当前场景的初始化、预加载、生成游戏对象以及更新游戏循环。通过扩展这些方法，就可以实现精彩纷呈的各种游戏了。

![mainstate.png][3]

## 扩展游戏场景

* 初始化方法：启动物理引擎（ARCADE），这是 Phaser 框架自带的最简单的物理引擎，用于矩形盒的碰撞检测，适于本游戏，设定游戏的背景颜色。
```js
main.init = function(){game.physics.startSystem(Phaser.Physics.ARCADE);
  game.world.enableBody = true;
  game.stage.backgroundColor = "#489ad8";
}
```
* 预加载方法：加载本游戏唯一的一张图片资源，关键在于设定每张图片的唯一 id，便于在整个游戏中引用。主要用到 `game.load` 加载器，用来加载游戏中需要的各种资源，用音乐，图片，精灵图，JSON 配置文件等等。
```
game.load.image('box', 'img/box.png');
```
* 生成游戏对象方法：添加左右墙壁，地面以及主角、奖励以及障碍物。代码展示如何生成地面，里面用到了 phaser 中组（Group）的概念。用于管理相同的、游戏中大量出现的游戏对象（比如子弹、道具等，比起用循环来增删对象，使用组更加有效率，性能更高，实现了缓冲池的功能）。向游戏中添加游戏对象主要用到 `game.add` 方法，用来快速将对象加入到游戏舞台上，如精灵，文字，声音等。然后开启地面图片的碰撞属性，设置 `body.immovable=true`，防止主角从上方掉下时，将地面也砸下去。主角、奖励和障碍物生成代码类似，不再赘述。最后生成游戏控制按键（键盘中的上、下、左、右方向键）。
```js
main.create = function(){
  this.walls = game.add.group();
  ...
  //ground
  for(var i=1; i<13; i++){var wall = game.add.sprite(30*i, 90,'box','', this.walls);
    wall.scale.setTo(0.6, 0.6);
  }
  ...
  this.walls.x = 90;
  this.walls.y = game.world.centerY-60;
  this.walls.setAll('tint', 0x1a5882);
  this.walls.forEach(game.physics.enable, game.physics);
  this.walls.setAll('body.immovable', true);
  ...
  this.cursor = game.input.keyboard.createCursorKeys();
}
```
* 更新循环方法：通过方向键控制主角左右移动和跳跃，当主角撞到障碍时，游戏重新开始，撞到奖励时，销毁奖励物品。
```js
main.update = function(){
  ...
  game.physics.arcade.overlap(this.player, this.lava, this.restart, null, this);
  ...
  if (this.cursor.left.isDown) 
    this.player.body.velocity.x = -200;
  ...
  if (this.cursor.up.isDown && this.player.body.touching.down) 
    this.player.body.velocity.y = -250;
}
```
* 其余方法：重新开始以及销毁奖励物品。奖励物品同地面类似，是用组来管理的，因此默认拥有 `kill` 方法来销毁自身。
```js
main.restart = function(){ game.state.start('Main'); }
main.getCoin = function(player, coin){ coin.kill(); }
```
## 链接

[GitHub][4]

## 后记
这个游戏虽然简单，但是涉及到了开发一个 html5 小游戏的各个方面。游戏开发是一条很长远的路，其中每一点都可以进行深入地研究和扩展。就此游戏而言，可以加入记分系统，更改地面及墙壁障碍的位置来生成关卡，还可以给主角添加动画效果，加入音效提升游戏体验等等。这些都是要慢慢扩展出来的。想法是要实现出来的。在实现的过程中，有时会触发更多灵感，但更多的是向现实妥协，舍弃掉一些东西，然而这样才是真正的成长。


  [1]: /img/2220626428.png
  [2]: /img/1756991379.png
  [3]: /img/1364379557.png
  [4]: https://github.com/chunqiuyiyu/learn-javascript/tree/master/platformer
