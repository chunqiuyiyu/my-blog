---
title: Sublime Text 插件开发
date: 2017-09-19 10:04
tags: [Sublime Text, 插件, Python]
---

## 前言
Sublime Text（以下简称 ST）是一款相当出色的编辑器，我第一次使用，是被它的速度与颜值（没办法，我就是这么肤浅）所吸引。但是，随着时间的推移，我感受到了它更多的优秀之处，现在已经成为我最喜欢的编辑器。绝大部分的代码与文档，我是在 ST 中完成，包括当前的这篇文章。之所以说是绝大部分，是因为 ST 本质上是一款文本编辑器，而不是 IDE（集成开发环境），使用它来开发脚本代码（如 JavaScript、Python、PHP 等）相当方便，但是对于一些“重型”语言（如 Java、C#、C++ 等）就有些力不从心了。当然，通过 ST 强大的插件系统，完全可以在 ST 上配置出一个适于静态编译语言的开发环境，但这样做的话，就失去了 ST 的灵活性，太多的插件会影响 ST 的速度。对于这些静态语言来说，IDE 是最好的选择。

## 插件
ST 强大的插件系统也是吸引我的地方。通过安装插件，几乎可以满足所有的开发需求。对于一些个性化的功能，就可以自己开发插件来实现，十分方便。这篇文章梳理了开发一款 ST 插件的流程与思路。需求是这样：在文章的中英文（或者数字）之间添加空格，使排版更加好看。按理来说，样式与内容应该分离，但是由于汉字与字母（数字）之间大小天生的差异，在它们之间插入一个空格，会让内容清晰可辨，便于阅读。

## 示例
打开 ST 菜单 Tools -> Developer -> New Plugin...，ST 会生成一个示例的插件代码：
```python
import sublime, sublime_plugin

class ExampleCommand(sublime_plugin.TextCommand):
    def run(self, edit):
        self.view.insert(edit, 0, "Hello, World!")
```
可以得知 ST 插件开发使用的是 Python 语言。保存当前文件到 ST 的包目录下（包目录可以通过菜单 Preferences -> Browse Packages... 看到）。然后`Ctrl`+`` `打开 ST 的控制台，这就是一个 Python 的 REPL（交互式解释器）。在上面输入`view.run_command('example')`调用插件，会发现`Hello, World!`已经被插入到当前编辑区的开头。

在包目录下，插件是热加载的，每次更改插件代码并保存，在控制台中可以看到`reloading plugin`字样。调用插件时，调用命令与插件类名是对应的，如示例中的 `example` -> `ExampleCommand`，类名就是将调用命令转变为驼峰命名然后加上`Command`，如果插件需要调用其他的 Python 文件，则入口文件名必须与插件名称（插件文件夹名称）一致。开发 ST 插件，本质上就是调用`sublime`与`sublime_plugin`模块中的 API 实现我们需要的功能。如果你需要，也可以调用 Python 的其他模块。

## 结构
从示例的代码完成整个插件的开发显然不太方便，比较快速的方法是找到包目录下的其他插件，复制一份出来，然后删除不用的内容，修改并添加代码即可。本文插件取名为 format-gap，结构如下（一个常规的插件应当会包括如下内容）：
- `Context.sublime-menu`：右键菜单配置文件，里面是 JSON 格式声明，定义了右键菜单的名称（caption）与对应调用的命令（command）。与此文件类似的还有`Main.sublime-menu`（主菜单配置文件）与`Side Bar.sublime-menu`（侧边栏菜单配置文件）
- `Default (Windows).sublime-keymap`：快捷键配置文件。里面也是用 JSON 定义了快捷键（keys）与对应的调用命令（command）。如果你熟悉 ST，就会知道 JSON 在 ST 中随处可见，所有的配置文件都是 JSON 格式。当前插件只运行在 Windows 中，所以只有这一个文件。想让快捷键可以在其他系统上生效，可以添加`Default (Linux).sublime-keymap`与`Default (OSX).sublime-keymap`。设定快捷键时注意不要与其他插件或者系统的快捷键发生冲突
- `Default.sublime-commands`：命令面板配置文件。内容与上面的文件类似，定义了插件在命令面板中的菜单。命令面板可以通过快捷键`Ctrl`+`Shift`+`P`打开
- `format-gap.py`：插件主文件

## 流程
format-gap 插件处理流程很简单：调用时，找到当前编辑区内容中所有的英文与数字，遍历这这些英文与数字字符串，检测字符串开头左侧与结尾右侧是否为汉字，如果是，就插入一个空格。`FormatGapCommand`类的`run`方法中添加左侧空格的代码如下（调用插件就是运行插件的`run`方法，插件的入口就在这里）：
```python
word = self.view.find_all(r'[a-zA-Z0-9]+')
offset = 0

if word:
  for item in word:
    # Insert left space
    index = item.begin()
    flag = re.match(u"[\u4e00-\u9fa5]", self.view.substr(index + offset - 1))
    if flag:
      self.view.insert(edit, index + offset, ' ')
      # Because the current view is changed by inserting space
      # we should add the offset to get correct position
      offset = offset + 1
```
需要注意的是，我们只在刚开始获取了英文与数字的位置，随着空格的插入，新空格插入的位置会发生改变，因此，**遍历时需要一个`offset`来记录偏移了多少位置**，这样后续空格插入的位置才是准确的。

同时我们只想让插件在编辑 Markdown 格式的文件时起作用，需要重载`FormatGapCommand`类的`is_enabled`方法，在文件名后缀不为`md`时返回`False`。这样，编辑其他格式的文件时，菜单中的 Format Gap 选项就是灰色的，快捷键也不会起作用，防止误操作。
```python
# We only need 'Format Gap' in Markdown file
def is_enabled(self):
  name = self.view.file_name()
  if name[-2:] == 'md':
    return True
  else:
    return False
```

以上就是 format-gap 插件全部的开发流程，非常简单，在 ST3 版本中开发完成，适用于 ST3，源代码已经上传到 [GitHub](https://github.com/chunqiuyiyu/python-tools/tree/master/format-gap)。就在不久前，ST3 的正式版已经发布，赶快更新到最新版本吧，ST2 已经过时了。如果想要了解更多关于 ST 插件开发的内容，请访问[官方文档](http://www.sublimetext.com/docs/3/)。

## 后记
当前编辑器领域可以说是百花齐放，既有上古大神 Emacs 与 VIM，又有后起之秀 Atom、 Visual Studio Code（以下简称 VSC），还有经典稳重的 Notepad++、TextEdit 等。在这场永远不会停止的编辑器战争中，Emacs 与 VIM 学习成本过高，早已封神，很少有人问津，Notepad++ 之流颜值欠缺，Atom 功力不足（卡顿），纷纷败下阵来休养生息，只有 VSC 出身名门（微软的编辑器真心没话说，就两个字：好用），渐渐地有一统代码编辑器之势。但这都没有关系，正如 ST 的官网所说：这是一款你最终会爱上的编辑器，我早已离不开它了。
