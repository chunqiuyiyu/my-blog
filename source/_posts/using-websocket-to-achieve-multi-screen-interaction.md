---
title: 使用 websocket 实现多屏互动
date: 2016-03-17 18:41
tags: [HTML5, Web, Node.js]
---
## 前言
websocket 是 html5 中的一种通信协议，与 http 协议的 “请求——响应” 机制不同，websocket 在建立连接后，浏览器和服务器之间就能实现全双工通信。简单来说，建立了 websocket 连接后，浏览器和服务器之间就能实时而自由地交流。这个特点，正是实现多屏互动的基本要素所在。


<!--more-->


## 实现
实现技术用到了 socket.io + node.js。原因很简单，websocket 协议需要浏览器和服务器的交互，而 node.js 正好提供了一个服务器环境，开发语言统一为 javascript，十分方便快捷。socket.io 则为浏览器和服务器提供了统一而简单的编程接口。

这次，要实现的例子是一个协同的画板样例，运行在 node.js 下。首先，建立样例项目 painter，并安装 express 和 socket.io 模块。其中 express 处理网络请求，socket.io 实现 websocket 连接。

然后就是程序的入口文件 `index.js`, 主要功能是在本地端口（`localhost:3000`）运行服务器，当浏览器访问根目录时返回 `painter.html` 文件，并监听 `painter.html` 中传来的画笔事件，里面携带了画笔的位置信息。主要代码如下：
```js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){res.sendFile(__dirname +'/painter.html');});

io.on('connection',function(socket){
    ......
    socket.on('paint event', function(data){socket.broadcast.emit('paint event', data);
    });
    ......
});

http.listen(3000, function(){console.log('listening on *:3000');});
```
当浏览器页面上的画笔开始绘画时，依次会向服务器 `index.js` 传递 `begin`（画笔落下）、`painter`（绘制图案）和 `end`（画笔抬起）事件。服务器接着会使用 `socket.broadcast.emit` 方法向所有建立连接的页面传递画笔事件（除了发送信息的页面，防止干扰原有页面的画笔）。浏览器监听到这些事件后，解析出里面的画笔位置，就会绘制出相应的图案，达到了多屏互动的效果。

在 `painter.html` 中，首先创建 `<canvas>` 标签，并引入 `socket.io.js`，主要代码如下：
```html
</script>
    <script src='/socket.io/socket.io.js'></script>
    <script>
    var canvas_ = document.getElementById("_canvas");
    var context = canvas_.getContext("2d");
    ......
    var socket = io();
    socket.on('begin event', function(data){context2.beginPath();
            context2.moveTo(data[0], data[1]);
    });

    socket.on('paint event', function(data){context2.lineTo(data[0], data[1]);
            context2.moveTo(data[0], data[1]);
            context2.stroke();});
    ......
</script>
```
## 效果
运行项目 `node index.js`，用不同设备或者不同浏览器（当然是现代浏览器了:-)，赶紧抛弃古老陈旧的 IE 吧）访问本地端口：`http://localhost:3000`，然后在一个页面上绘画，其他所有连接的页面者会展示绘制的过程。示例图片的场景是我用手机绘制，两个 chrome 窗口展示效果。

![2527727131.gif][1]
## 链接
[github][2]
## 后记
初学者所作，有任何意见或者建议，欢迎向我反馈。真心希望 web 技术越来越好，提升每个人的生活品质。


  [1]: /img/3485089317.gif
  [2]: https://github.com/chunqiuyiyu/learn-javascript
