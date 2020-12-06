---
title: Web Audio API 绘制可视化音乐
date: 2017-04-03 11:50
tags: [HTML5, JavaScript, Web]
---
## 前言

Web Audio API 是 HTML5 提供的对音频处理的接口。乍看起来，好像很高端的样子，其实我们早已经使用过 Web API 了，比如说前端开发绕不开的 DOM（文档对象模型-Document Object Model）。DOM 提供了一系列 API 让我们可以操作文档中的节点（Node）与元素（Element）。当然现在很多轮子的出现使我们不再直接来操作 DOM，但这些轮子本质上也是对 DOM API 的封装，比如说大名鼎鼎的 jQuery。


<!--more-->


类似于 DOM，Web Audio API 提供了丰富的 API 来让我们操作音频。时代已经变了，在现在的 Web 页面中，简简单单的播放音乐已经不能满足人们的需求了，我们要对音频文件进行各种处理，让用户得到更好的体验，比如说这篇文章提到的绘制可视化的音乐，即绘制音乐的频谱。

## 预备知识

首先要了解频谱是什么？频谱是频率谱密度的简称，是频率的分布曲线。我们知道，声音是由振动产生的，频率则用来描述振动的快慢，在人耳可以听到的范围（20Hz~20000Hz）内，频率越高的声音越尖，频率越低的声音越沉。主观上的感受大家都不一样，但我们可以用客观数据来量化这种感受。首先对连续的音频信息进行采样，得到不连续的频率值，然后绘制出来，就形成了频道图。当我们看着高低起伏的频道图，听着音乐中的高低音，对应起来，对整个音乐的体验与理解就是多方位的。至于这首音乐是否好听，就是很主观的了，这里只是对频率上的分析。

对Web开发者来说，上面的知识已经足够了，说实话，我对这些知识的了解也是半调子，毕竟我不是专业人员。在 Web Audio API 中，需要重点关注的是音频环境（AudioContext），所有的音频处理必须在这个环境中进行。一个简单、典型的工作流应该是这样的：
1. 创建音频环境
2. 在音频环境里创建源 - 本例子中使用`audio`标签引入的音频数据
3. 创建效果节点 - 采样得到频率数据
4. 为音频选择一个目地 - 以60FPS绘制频率数据到`canvas`中
5. 连接源到效果器，以及效果器和目地

图示说明，来自 Mozilla 开发者文档。顺便说一句，虽然我的前端技术启蒙地是在 [W3school][1]，但是我觉得学习前端最好的文档应该是 [Mozilla 技术文档][2]。W3school 中的东西对于初学者来说当然好，简单方便，还可以在线运行代码。但是要想深刻理解学习前端最新、最全面的技术，MDN（Mozilla开发者文档）是首选。

![web-audio-api-flowchart.png][3]

## 代码梳理
我们需要 HTML 结构来承载音乐源与输出频谱图，只是一个简单的示例页面，没有做样式上的调整，要注意默认的 `canvas` 标签是有宽高的（300x150）。
```html
<div id="mp3_player">
        <div id="audio_box"></div>
        <canvas id="analyser_render"></canvas>
</div>
```
页面加载完成后，创建音频环境，创建频谱分析节点，创建音频源，然后连接源到分析节点，连接分析节点到音频环境中所有音频（节点）的最终目标节点，一般是音频渲染设备，比如扬声器（于是我们听到了美妙的音乐），最后通过音乐中的频率数据在 `frameLooper()` 函数绘制。
```JavaScript
document.getElementById('audio_box').appendChild(audio);
// AudioContext object instance
context = new AudioContext();
// AnalyserNode method
analyser = context.createAnalyser(); 
canvas = document.getElementById('analyser_render');
ctx = canvas.getContext('2d');
// Re-route audio playback into the processing graph of the AudioContext
source = context.createMediaElementSource(audio);
source.connect(analyser);
analyser.connect(context.destination);
frameLooper();
```
`frameLooper()` 中，用 `requestAnimationFrame` 实现 60FPS 的循环绘制。使用分析节点的 `frequencyBinCount` 得到绘制的数据值的数量，用 `Uint8Array` 储存这些数据。`Uint8Array` 数组类型表示一个 8 位无符号整型数组，创建时内容被初始化为 0。相较于普通无类型的 `Array`，`Uint8Array` 能更加快速高效地存储与处理二进制数据，广泛应用于文件数据以及 WebGL 中着色器数据的操作中。

分析节点 `analyser` 的 `getByteFrequencyData()` 方法将当前频率数据复制到传入其中的无符号整型数组。它的 `frequencyBinCount` 属性是 `fftSize` 属性的一半。`fftSize` 属性的值是一个无符号长整型的值, 用于确定频域的 FFT（快速傅里叶变换）的大小，范围是从 32 到 32768 内的 2 的非零幂，其默认值为 2048。所以此时 `fbc_array` 存储有 1024 个数据，每一个数据就是我们所需要的频率大小。最后在循环中将前 100 个数据绘制到 canvas` ，至此收工。

```JavaScript
requestAnimationFrame(frameLooper);
fbc_array = new Uint8Array(analyser.frequencyBinCount);
analyser.getByteFrequencyData(fbc_array);
// Clear the canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);
// Color of the bars
ctx.fillStyle = '#00CCFF'; 
bars = 100;
for (var i = 0; i < bars; i++) {
    bar_x = i * 4;
    bar_width = 2;
    bar_height = -(fbc_array[i] / 2);
    //  fillRect( x, y, width, height ) // Explanation of the parameters below
    ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
}
```
绘制出的频谱如下，这是其中截取的一帧（示例音乐是贝多芬著名的作品第五交响曲，也被称为命运交响曲，看着上下起伏的频谱图，听着激昂的音乐，有没有觉得作者紧紧地扼住了命运的喉咙呢？）：

![music-analyser.png][4]

## 链接
[源码][5]
[效果演示][6]
## 后记
这篇文章用到的一些预备知识。，其实在大学的《信息论》和《数字信号处理》中就已经学过，但是到现在要用的时候，早已忘得七七八八了，大学的时候，只是应付老师与考试，到头来，谁都没应付过去，只应付到了自己。

  [1]: http://www.w3school.com.cn/index.html
  [2]: https://developer.mozilla.org/zh-CN/docs/Web
  [3]: /img/web-audio-api-flowchart.png
  [4]: /img/music-analyser.png
  [5]: https://github.com/chunqiuyiyu/learn-javascript/tree/master/music-analyser
  [6]: http://www.chunqiuyiyu.com/usr/uploads/demos/music-analyser/index.html



