---
title: React 实践记录
date: 2017-11-06 17:09:28
tags: [React, Redux]
---
## 前言
最近工作中用 React 全家桶开发了一个项目，在感受到模块化开发方便快捷的同时也发现自己对于 React 及相关框架理解不是很透彻，很多重要的概念只停留在了记忆中，并没有正确地应用。这样也导致了项目开发时的效率低下，出现了各种问题，最后虽然一一解决，却花费了大量的时间与精力。正好今天在 GitHub 上看到一个热门的开源项目：[React Bits](https://github.com/vasanthk/react-bits)，其中是作者有关 React 最佳实践的总结分享。通读后收获颇大，现在就结合自己的理解将这些要点归纳一下。

## 设计模式和方法
### JSX 中的条件判断
如果条件比较简单，直接使用逻辑表达式中的短路运算或问号运算符。
```JavaScript
const sampleComponent = () => {
  return isTrue && <p>True!</p>
};
```
如果条件比较复杂，短路运算和问号运算符就不够用了，这时就要考虑是否应该拆分此组件，或者使用立即执行的函数表达式或者提前返回，以保证代码的清晰可读为准。
```js
const sampleComponent = () => {
  const basicCondition = flag && flag2 && !flag3;
  if (!basicCondition) return <p>Derp</p>;
  if (flag4) return <p>Blah</p>;
  return <p>Herp</p>
}
```
### 异步的 setState
`setState` 是 React 中重要的方法。React 的核心概念就是确定的状态对应确定的渲染界面。当我们想要改变界面时，并不对 DOM 直接进行操作，而是刷新相关的状态，这个操作就是通过 setState 实现。使用`setState`时请牢记一点：**`setState` 是异步的**。永远不要在`setState`后获取状态值，这个状态值是不确定的。
```JavaScript
// assuming this.state.count === 0
this.setState({count: this.state.count + 1});
this.setState({count: this.state.count + 1});
// this.state.count === 1, not 2
```
如果当前应用的状态需要依赖之前的状态，可以将一个函数传递给 setState，将之前的状态作为参数，避免用户在访问时获取旧状态值的问题。
```JavaScript
this.setState((prevState, props) => ({
  count: prevState.count + props.increment
}));
```
### 事件处理
如果事件处理函数中需要调用 this，请在构造函数中绑定防止 this 丢失，或者使用自动绑定 this 的箭头函数。
```JavaScript
class Switcher extends React.Component {
  constructor(props) {
    this._buttonClick = this._handleButtonClick.bind(this);
  }
}
```
### 获取组件
有时我们需要得到渲染后的组件实例，这时请使用`ref`设置回调函数。当组件挂载后，回调参数传入组件实例，组件卸载后或者`ref` 属性改变时，回调参数传入`null`，避免内存泄露。`ref`还可以设置为字符串`ref="input"`，然后通过`this.refs.input`访问。使用回调函数设置组件是获取组件的推荐方法，React 自动完成获取到组件的生命周期管理，不需人为干预。
```JavaScript
<input ref={el=> { this.el = el; }} />
```
## 后记
以上几点都是我在项目中用到比较多且容易出错的地方。更多有关 React 方面的技巧和实践方法，请移步到[React Bits](https://github.com/vasanthk/react-bits)阅读学习。当然，React 中还有更多的“陷阱”等待我们发现，编程路上总不会一帆风顺，有问题才会有成长。另外，GitHub 真是开发者的宝库，我庆幸有这样一个地方。
