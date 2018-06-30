---
title: Node.js 开发命令行程序
date: 2018-06-25 15:44
tags: [Node.js, ES6, 音乐]
---

## 前言

随着现在频繁地使用 shell，我越发感觉到命令行程序的方便与快捷。为了加深自己对命令行程序的理解，我使用 Node.js 开发了一个命令行界面（CLI）的小程序：[Lrcer](https://github.com/chunqiuyiyu/learn-javascript/tree/master/lrcer)，用来下载网易云音乐上自己喜欢的音乐歌词，以下是要点记录。

## 所需依赖

* chalk - 在控制台界面输出有颜色的字体，如红色的警告信息，和绿色的成功信息

* clear - 如名字所见，此依赖用于清空控制台上的历史信息

* clui - 绘制命令行程序的界面，Lrcer 使用了它提供的加载提示（Spinner）功能

* figlet - 输出程序名称的字符画

* inquirer - 生成功能强大的交互式命令行界面，用来获取用户的输入

* commander  - 整个程序的基石，将所有依赖集合在一起，并根据相关配置生成最终的程序

## 流程梳理

此程序逻辑流程十分简单，核心在于两个 API，一个 API 根据搜索时提供的歌曲名称请求对应的 ID，另一个 API 根据歌曲的 ID 请求到相应的歌词数据，最后使用 Node.js 的 `fs`  模块将歌词数据写入本地的文件系统。

### 开始

确保本地已经成功安装了 Node 与 NPM。新建项目并初始化，同时用 NPM 安装上述所有依赖。

```shell
mkdir lrcer
cd lrcer/
npm init
npm install chalk clear clui figlet inquirer commander --save
```

编辑  `package.json`  文件，添加  `bin`  字段指向程序的入口文件 。

```json
"bin": {
   "lrcer": "./index.js"
}
```

并确保入口的 JS 文件添加了正确的 Shebang 字符串  `#!/usr/bin/env node` ，此字符串会告知系统使用 Node 命令来运行此脚本。如果要在本地调试并查看效果，请使用  `npm link`  将本地项目软链接到全局的 Node 模块中，这样就可以直接在控制台输入 lrcer 来运行本程序了。

### 配置

安装 commander 后，开发命令行程序就变得十分简单，通过链式调用的方式，设置好程序的版本号、描述、命令等信息。

```js
program
  .description('Download lyric files of 163 musics with CLI.')
  .version('0.0.1')
  .usage('lrcer <cmd> [input]');

// Search music
program
  .command('search')
  .alias('s')
  .description('search music with name')
  .action(function(name) {
    utils.searchMusic(name);
  });
...
program.parse(process.argv);
```

### 执行

当我们在控制台输入 `lrcer search`  后，commander 会调用我们在配置命令时  `action`  设定的函数，并将控制台中输入的参数解析传递进来，这样我们就可以操作这些参数，实现所需要的功能。

上面配置示例代码中， 我们在  `lrcer search`  时调用了  `searchMusic`  函数，请求 API 时通知用户耐心等待（API 由非官方热心网友提供，速度无法保证，稳定性更加无法保证，说不定哪天就挂了，且用且珍惜）。

```js
const countdown = new Spinner('Take some time, please wait patiently...');
countdown.start();
```

得到响应数据后，传递到 inquirer 中，生成一个选项界面，让用户指定他需要的歌曲进行下载。

```js
show: (songs) => inquirer.prompt([{
    type: 'list',
    name: 'song',
    message: 'Here are ' + songs.length + ' results, choose one to download',
    choices: songs.map((i, index) => stringMap(i, index))
}]).then(answers => {
  	...
}
```

用户选择后，得到相关的歌曲 ID ，调用下载的接口，请求查询歌词的 API，就可以得到歌词文件。

## 预览

说了那么多，来看看最后的效果，选用的下载歌曲是《刺客信条：启示录》的主题曲 Iron，感受艾吉奥复追寻真理的决心与意志。

![screen.gif](/img/screen.gif)

## 结语

在折腾了好几天并更换了电脑后，我终于在 Win10 系统的 WSL（Windows Subsystem for Linux）上成功运行起了工作项目。不得不说，微软现在的战略是越来越开放了，推出了 VSCode，不久前还收购了 Github。作为开发者，应该保持冷静与独立思考，一提起 Windows 与微软，总有人想都不想张嘴就喷，实在是滑稽可笑，但愿你我不要成为这样的人。

