---
title: JavaScript 中的 Switch(true) 模式
date: 2021-05-22 23:51
tags: [ES6, JavaScript]
---

作为一位前端开发者，你对 `switch` 语句一定不陌生，`switch` 语句用于处理多条件匹配的场景。根据 [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch) 的说法：`switch` 语句评估一个表达式，将表达式的值与 case 子句匹配，并执行与该情况相关联的语句。如下所示：

```js
const food = 'apple'

switch (food) {
  case 'apple':
    console.log('The apple is red.')
    break
  case 'banana':
    console.log('The banana is yellow.')
    break
  case 'orange':
    console.log('The orange is orange.')
    break
  default:
    console.warn('Unknown fruit!')
}
```

在上面的代码中，`switch` 检查表达式（`food` 变量）的值，根据不同的水果输出它的颜色，如果没有匹配到对应的 `case` 子句，则跳转到 `default` 语句，输出警告信息。

## Switch(true) 模式

第一次看到 `switch(true)` 模式的代码，你也许觉得非常滑稽，感觉没有意义：

```js
switch (true) {
  // always work
  case 'A':
    // TODO
    break
  case 'B':
    // TODO
    break
  default:
  // TODO
}
```

但事实并非如此。关键在于：**`case` 语句是支持表达式的**。在以前使用 `switch` 语句时，我们通常是把表达式放在 `switch` 语句中，然后用 `case` 语句去匹配计算后的值，现在 `switch(true)` 是百分百执行的，这样就可以用 `case` 语句执行表达式去处理对应的代码逻辑。

## 用途

`switch(true)` 模式可以用于替换复杂的 `if/else` 结构。假如我们需要验证当前的用户信息是否有效：

```js
const user = {
  firstName: 'John',
  lastName: 'Barry',
  email: 'my.address@email.com',
  number: '00447123456789',
}
```

脑海中自然而然会浮现出如下代码：

```js
if (!user) {
  console.error('User must be defined.')
} else if (!user.firstName) {
  console.error("User's first name must be defined")
} else if (typeof user.firstName !== 'string') {
  console.error("User's first name must be a string")
}
```

这只是验证个用户信息中 `firstName` 字段，如果加上后面 `lastName`、`email`、`number` 字段的验证方法，整段代码就会变得十分杂乱。《Refactoring: Improving the Design of Existing Code（重构：改善既有代码设计）》的作者 Martin Fowler 这样教导我们：

> “Any fool can write code that a computer can understand. Good programmers write code that humans can understand.” （任何傻瓜都可以编写电脑能够理解的代码，优秀的程序员才能编写人类可以理解的代码）

如果我们重构上述的代码，一种方式是使用迟早返回（Return Early Pattern）:

```js
const userValidator = (user) => {
  if (!user) {
    return console.error('User must be defined.')
  }

  if (!user.firstName) {
    return console.error("User's first name must be defined")
  }

  if (typeof user.firstName !== 'string') {
    return console.error("User's first name must be a string")
  }

  return user
}
```

还有一种方法就是 `switch(true)` 模式，为了进一步提升代码可读性，示例代码将测试条件提取为谓词函数（根据条件，返回真值或者假值的函数）：

```js
switch (true) {
  case !isDefined(user):
    console.error('User must be defined.')
    break

  case !isDefined(user.firstName):
    console.error("User's first name must be defined")
    break

  case !isString(user.firstName):
    console.error("User's first name must be a string")
    break

  default:
    return user
}
```

## 优势

与迟早返回模式相比，`switch(true)` 模式的有如下两点优势：

1. 可以天然应用 `switch/case` 语句多准则匹配特性，减少逻辑或 `||` 操作符的出现，视觉上代码更加干净清晰。

```js
switch (true) {
  case !isDefined(user):
  case !isDefined(user.firstName):
  case !isDefined(user.number):
    console.error('User not valid.')
    break

  default:
    return user
}
```

2. `case` 语句表达式匹配为严格匹配，没有隐性的类型转换，迫使开发人员对使用的表达式做到心中有数，使代码运行更加稳定。

```js
const a = 1
const b = true

const switchTruePattern = () => {
  switch (true) {
    case a:
      console.log('a')
      break
    case b:
      console.log('b')
      break
  }
}

const returnEarlyPattern = () => {
  if (a) {
    return console.log('a')
  }

  if (b) {
    return console.log('b')
  }
}

switchTruePattern() // Output: b
returnEarlyPattern() // Output: a
```

## 结语

在我看来，`switch(true)` 模式有其存在的合理性，是一种有效可行的重构手法，适当使用能够提升代码的可读性。但也有很多人觉得这是一种“反模式”，是对 `switch` 语句的滥用。实际项目开发中是否选择使用，见仁见智，取决于各人的看法。

## 参考

- [Using the Switch(true) Pattern in JavaScript](https://seanbarry.dev/posts/switch-true-pattern)
- [Using switch(true) in JavaScript](https://medium.com/trabe/using-switch-true-in-javascript-986e8ad8ae4f)
- [Pattern Matching in JavaScript](https://kyleshevlin.com/pattern-matching)

