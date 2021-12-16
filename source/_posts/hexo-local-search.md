---
title: Hexo 博客添加本地搜索
date: 2018-07-30 14:05
tags: [hexo]
---

## 说明
随着博客文章的数量越来越多，搜索功能变得越来越重要。如果要寻找一篇之前的文章，一个小小的搜索框就能帮上大忙。动态博客（如 WordPress、 Typecho 等）中搜索是内置的功能，无需使用者配置，但对 Hexo 这样没有后端数据库的静态博客来说，添加搜索就需要花一点心思了。

## 分类
一般而言，为静态博客添加搜索功能有以下三种方式（本质上只有一种，就是查询数据，不同的是数据放在哪里）：

1. 通过搜索引擎查询。这种方法非常简单，用户点击搜索框时调用搜索引擎的指定方法`site:example.com keyword`，但这种方法要求网站权重高，具有一定的收录量，如果没有什么收录量，这种方法就失效了。

2. 第三方搜索。网上有很多这样的 SaaS（Software as a Service）平台，对于大量数据的搜索，请使用这样的服务。使用方法是免费用户 ~~韭菜~~ 最熟悉的那一套，首先注册平台网站的账号，然后导入数据，最后调用平台 API 进行搜索。我自己并不敢使用这样的服务，我希望个人数据掌握在自己手中。

3. 本地搜索。通过插件生成序列化数据，前端调用脚本处理数据，将结果返回。此种方法适于小数据量的独立博客和爱折腾的博主。本文重点介绍这种方式。

## 流程

### 安装插件
安装 hexo-generator-search 用来生成博客文章数据。

```shell
npm i hexo-generator-search --save
```
然后在 `_config.yaml` 中配置插件。

```yaml
search:
  path: search.xml
  field: post
  format: html
```
安装插件后，每次使用 `hexo s` 与 `hexo g` 命令后此插件会抓取最新的文章内容到 `search.xml`中，这个文件就是我们查询服务的数据库。

### 添加搜索框
在 `themes/polk/layout` 中合适的位置添加搜索框（想加哪儿就加哪儿，看着喜欢就好）。我自己的博客是将搜索框与标签云放置在独立显示的导航页面中。

```html
<div class="search">
  <input type="text" autocomplete="off" name="search" placeholder="搜索" id="local-search-input">
  <div id="local-search-result"></div>
</div>
```

### 添加脚本
此时我们有搜索框来接受用户输入，也有后端容纳数据，是时候让 JavaScript 大显身手了。

```js
var inputArea = document.querySelector("#local-search-input");
if (inputArea) {
    inputArea.onclick = function() {
        inputArea.placeholder = '首次搜索，需载入索引文件，请稍候';

        getSearchFile();
        this.onclick = null
    }
    inputArea.onkeydown = function() { if (event.keyCode == 13) return false }
}

var getSearchFile = function() {
    var path = "/search.xml";
    searchFunc(path, 'local-search-input', 'local-search-result');
}

```
要注意的是，如果博客文章比较多，那么生成的 `search.xml` 会比较大。为了较好的用户体验，我们在用户点击搜索框时才使用 AJAX 加载此文件，并提示用户耐心等待。 `searchFunc` 会在搜索框上绑定 `input` 事件，每次用户输入，用正则匹配出相关的数据并显示在列表区域中。`searchFunc` 代码逻辑非常简单，如果需要详细了解，请移步 [GitHub](https://github.com/chunqiuyiyu/my-blogs/blob/master/themes/polk/source/js/utils.js) 观看。

## 后记
折腾来折腾去，高质量的文章没有写几篇，倒是流水账似地记录一些心情笔记，博客也变得越来越水。以前总想着轰轰烈烈地生活，不由自主地期待着发生特殊的事情，现在看来，生活的常态就是平平淡淡，顺其自然吧。
