---
title: 学习 Redux
date: 2018-07-12 11:02
tags: [React, Redux, ES6]
---

## 前言
使用 React 全家桶系列已经有一段时间了，从刚开始的不知所措到现在的 ~~熟练粘贴~~ 得心应手，我学到最有价值的一件事就是保持好奇与思考。当引入一个新技术时，不只是被动接受与使用，更重要的是想一想，为什么要使用这个技术，使用它会带来什么好处与缺点。涉及到今天的主角 Redux，就需要思考为什么使用它，使用 Redux 的利弊是什么。

## 概念
学习新知识点，概念很重要。你也许会从各种各样的 React 教程中得知了我们主角（Redux）的大名，然而它很委屈，Redux 大声嚷道：“我和 React 没什么关系，我们之间的关系就如同 Java 与 JavaScript 之间的关系一样。” **Redux 只是一个可预测的状态容器**，只不过经常和 React 搭配使用，所以才会出现在一些 React 的文档和教程中。

明确了 Redux 是什么，接下来的问题是要不要使用它。其实当你问出这个问题时，你可能很大程度上并不需要使用它。Redux 就像吃饭时用的勺子一样，当你要喝汤的时候，自然而然会使用勺子。当你的 Web 应用状态十分复杂甚至让你觉得有些混乱时，Redux 就是你的好帮手。

## 思想
Redux 是一种发布/订阅者模式，核心思想是单向数据流，简单的描述就是：用户操作或者与后端交互数据触发 Action —> Reducer 更新状态 —> 订阅者组件根据新状态更新界面，使用 Redux，就是在不停地重复上面的步骤。由此思想，Redux 有以下的准则：

1. **单一的数据源**。整个应用的数据存一个 Store 中，这个 Store 就是简单的 JS 对象。
2. **状态是只读的**。状态只能通过触发 Action（发布者）才能更新。Action 也是简单的 JS 对象，按标准来说，Action 应当包含充当标识的 type 属性和承载数据的 payload 属性。
3. **使用纯函数修改状态**。这里的纯函数叫做 Reducer，“纯”的意思是不产生副作用，换句话说，不要通过赋值的方法直接修改状态，而是通过 Reducer 返回新的状态。这点很重要，这是保证 Redux 状态可预测的基础。

## 基本 API
Redux 的使用同样非常简单，这里我们可以试着实现一些核心的 API，来深入学习 Redux。Redux API 的核心是 Store，Redux 通过 Store 管理应用的状态。`createStore` 方法实现如下，从名字就可以看出来，这个方法创建应用唯一的 Store。

```js
const createStore = (reducer, initialState) => { 
  const store = {};
  store.state = initialState;
  store.getState = () => store.state;
  ...
  return store;
}
```
上面就是创建 Store 的基本代码，但是别忘了，还需要实现发布/订阅者模式。

```js
store.listeners = [];

store.subscribe = (listener) => {
  store.listeners.push(listener);
};

store.dispatch = (action) => {
  store.state = reducer(store.state, action);
  store.listeners.forEach(listener => listener());
};
```
上面的方法中引入了 Reducer, 这里是我们真正操作数据的地方。

```js
const reducer = (prevState, action) => {
  let nextState = {};
  ...
  return nextState;
};
```
学习 Reducer，可以类比 JS 数组操作中的`reduce`方法，Reducer 会对上一个状态（prevState）应用 action，然后返回新的状态（nextState）。

说到这里，Redux 核心的 API 已经完成了，你也许觉得不可思议，但 Redux 就是这么简单，非常直白，没有任何“黑魔法”，这也是我喜欢它的地方。

## 实践
现在，我们可以使用自己实现的 Redux 来写一个 Demo 了。这个 Demo 是个自增的计数器，界面就是普通的 HTML 页面（再一次提醒 Redux 并不一定要搭配 React 才能使用）。

```html
<span class="countor"></span>
<script>
  const dom = document.querySelector('.countor');
</script>
```

准备创建 Store 所需的 reducer 与 state。

```js
const state = {
  count: 0
};

const reducer = (state, action) => {
  switch(action.type) {
    case 'ADD':
     return {
      count : state.count + 1
     }

    default:
      return state;
  }
};
```
创建 Store，监听界面变化并初始化应用，在用户点击计数器时触发 Action，至此此所有代码完毕。

```js
const store = createStore(reducer, state);
store.subscribe(() => {
  const state = store.getState();
  dom.innerHTML = state.count;
});

// init
store.dispatch({});

// action
dom.addEventListener('click', () => {
  store.dispatch({
    type: 'ADD',
    payload: ''
  });
});
```

## 后记
追求最新的技术并没有错，但是要记得拨开新技术的迷雾，看到它传递的思想。通过 Redux，我了解到如何把函数式编程融入到实际的开发之中。以前我觉得函数式编程是一种“飘在空中”的编程范式，现在看来，它是如此频繁地出现在我们周围，切切实实地帮助我们提升了开发效率。感谢 Redux，感谢开源社区。
