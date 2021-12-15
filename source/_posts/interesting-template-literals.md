---
title: 有趣的模板字面量
date: 2018-08-24 14:32
tags: [JavaScript, ES6]
---

如果你在 React 项目中使用 [styled-components](https://github.com/styled-components/styled-components) 来编写组件样式，你一定会对下面的写法感到熟悉。

```JavaScript
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;

  ${props => props.primary && css`
    color: white;
  `}
`
```

styled-components 之所以能够使用这样直观的方式生成有样式的组件，正是使用了 ES6 中的模板字面量（Template Literals）。在 ES6 之前，这个语言特性被称为模板字符串（Templat Strings）。

## 名词解释
学习模板字面量之前，先来看看字面量是什么。字面量是程序中表示固定值的符号（token），字面量是一种符号（这种符号由编程语言的语法定义），最终的值是一个常量（固定值）。在 JS 中，存在以下字面量：

* 数组字面量 (Array literals)：`const data = [ 'one', 'two', 'three' ]`
* 布尔字面量 (Boolean literals)：`true` 和 `false`
* 整数字面量 (Integer literals)：十进制 `3`、八进制 `0o15`、十六进制 `0x11`、二进制 `0b11`
* 浮点数字面量 (Floating-point literals)：`-3.12e+12`
* 对象字面量 (Object literals)：`const obj = { a: 1, b: 2 }`
* 正则字面量 (RegExp literals)：`const reg = /ab+c/`
* 字符串字面量 (String literals)：`const str = 'one line \n another line'`

模板字面量并不是新的字面量，它是 ES6 提供的一种语法糖（甜甜的，不要多吃，小心蛀牙:-)），本质上是字符串字面量。

## 基础用法
模板字面量用反引号（\`some text\`）包裹字符串。被包裹的字符串中可以包含特殊字符，也可以用 `${}` 占位符输出 JS 的表达式的值。简单来说，拼接复杂的字符串不需要 `+` 和 `\n`（或者其他控制符） 了。

```JavaScript
`string text line 1
 string text line 2`

`string text ${expression} string text`
```

## 高级用法
模板字面量有趣的地方在于可以使用自定义的标签函数对字符串进行处理，这种用法被称作标签模板字面量（Tagged Template Literals）。

```JavaScript
const tag = (...args) => { console.log(args) }
// -> [ [ 'string ', ' and ', '' ], 'test', 3 ]

const str = tag`string ${ 'test' } and ${ 1 + 2 }`
```

通过上面的例子可以发现，标签函数会将模板字面量从占位符处分开，占位符前后的字符串与表达式的值作为参数传递到函数内部，凭借标签函数的这种机制可以让我们灵活地处理字符串。别忘了，JS 中函数可以像其他值一样传递，所以在标签函数中也可以执行函数，但是尽量不要嵌套过深，避免混乱。标签函数也不一定非得返回字符串，你可以根据自己的需求任意返回，开头示例代码中 styled-components 接收 CSS 代码为输入，最终生成了一个组件。

## 实践

### 微模板
如果手头有一些简单的数据需要展现到 HTML 上，且不想引入额外的框架，模板字面量可以充当简单的微模板。

```JavaScript
const data = [ 'one', 'two', 'three' ]
const render = (...args) => (
  args[1].map(item => `<li>${item}</li>`).join('')
)

const html = `<ul>${ render`${data}` }</ul>`
// -> <ul><li>one</li><li>two</li><li>three</li></ul>
```

### 安全编码
对用户输入的值进行安全编码，避免 XSS 攻击。
```JavaScript
const htmlEscape = (str) => (
  str.raw[0].replace(/&/g, '&amp;')
     .replace(/>/g, '&gt;')
     .replace(/</g, '&lt;')
     .replace(/"/g, '&quot;')
     .replace(/'/g, '&#39;')
     .replace(/`/g, '&#96;')
)

const inputValue = htmlEscape`<script>alert('XSS')</script>`
// -> &lt;script&gt;alert(&#39;XSS&#39;)&lt;/script&gt;
```
### 国际化
```JavaScript
const data = {
  en: {
    hello: 'hello'
  },
  zh: {
    hello: '你好'
  }
}

const i18n = {
  en: (raw, msg) => ( data['en'][msg] ),
  zh: (raw, msg) => ( data['zh'][msg] )
}

i18n.en`${'hello'}` // -> hello
i18n.zh`${'hello'}` // -> 你好
```

## 结语
以上只是模板字面量简单的用法，发挥想像力，就可以让模板字面量发挥强大的作用，ES6 还有更多神奇的地方，等待我们慢慢发掘。
