import applyMiddleware from "./applyMiddleware";
import createStore from "./createStore";
import testReducer from "./createStore.test";
import logger from "./redux-logger";

// 创建store
const { dispatch, getState, subscribe } = createStore(testReducer, applyMiddleware(logger));

// 监听state的变化
// 控制台打印：
// =======logger=======================start
// preState： 0
// action {type: 'increment'}
// nextState： 1
// =======logger=======================end

const unsubscribe = subscribe(() => {
  // 获取最新的state
  const state = getState();
  console.log('new state: ', state);
});

// 发起更新state的动作
dispatch({ type: 'increment' });

// 接触监听
unsubscribe();