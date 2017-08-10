---
title: music-player：基于 react 的音乐播放器
date: 2017-04-29 14:10
tags: [JavaScript, 音乐, React]
---
# music-player
基于 [create-react-app](https://github.com/facebookincubator/create-react-app) 脚手架工具实现的音乐播放器。


<!--more-->


## 如何开始

```
git clone https://github.com/chunqiuyiyu/music-player.git
cd music-player
npm install
npm start
```

## 已实现
- 歌曲列表
- 歌词同步显示
- 本地资源（音乐与歌词）读取
- 自定义的播放器样式
- 基本的播放功能（音乐的播放与暂停、顺序播放）

## 示例
[Demo](http://www.chunqiuyiyu.com/music/)

## 添加音乐
1. 添加音乐文件与对应歌词文件（文件名保证一致）到`./public/musics/`路径
2. 修改 ./public/musics/list.json ,添加音乐信息，包括音乐名称、演唱家名称与歌词名称，其中音乐名称、演唱家名称显示在播放器控件与歌曲列表中，歌词名称就是上一步中定义的文件名（应用通过此文件名加载音乐与歌词）
```
{
  "song_name": "song_name",
  "artist": "somebody",
  "lrc_name": "lrc_name"
}
```
3. 使用`npm start`重新编译运行项目
4. 如果要发布到正式环境，请使用`npm build`, 打包后的文件在`./build/`下，部署此目录下所有文件到线上即可

## 结语
感谢 react、webpack、babel 等一系列优秀的开源项目，可以让前端开发如此简单快乐。




