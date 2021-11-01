// 创建store
// 创建store前，我们先来分析一下它有哪些功能：

// 储存状态
// 需要被监听state的状态的变化，需要通知UI组件state的更新（订阅者模式）

// 返回四个方法：
// dispatch(action)：负责派发action到store
// getState：获取当前store的state
// subscribe(listener)：注册一个 state 发生变化时的回调函数
// replaceReducer(nextReducer)可用于热重载和代码分割。通常你不需要用到这个 API（本次不实现该API）。

// createStore(reducer, applyMiddleware(middleware1, middleware2));
export default function createStore(reducer, enhancer) {
  let currentState = null;  // store中存储的状态
  let currentListeners = [];  // 事件中心

  function dispatch(action) {
    // state改变的唯一方式，是通过reduce使用action和上一次的state计算出新的state
    currentState = reducer(currentState, action);
    // 当触发state后，通知view，state更新需重新渲染
    currentListeners.forEach((listen) => listen());
  }

  // 获取当前store中的state
  function getState() {
    return currentState;
  }

  // 注册state发生变化时的监听
  function subscribe(listen) {
    currentListeners.push(listen);
    // 返回一个解除监听的函数
    return function unsubscribe() {
      const index = currentListeners.indexOf(listen);
      currentListeners.splice(index, 1);
    }
  }

  // 当传入中间件时，使用中间件增强dispatch
  if (enhancer) {
    return enhancer(createStore)(reducer);
  }

  // 获取初始值，在redux中会有combineReducer中进行reduce的调用获取初始值
  dispatch({type: 'REDUX/XXX'});

  return {
    dispatch,
    getState,
    subscribe
  }
}