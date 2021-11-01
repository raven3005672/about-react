import createStore from "./createStore";

// 创建一个reducer
export default function testReducer(state, action) {
  switch(action.type) {
    case 'increment':
      return state + 1;
    case 'decrement':
      return state - 1;
    default:
      return 0;
  }
}

// 创建store
const { dispatch, getState, subscribe } = createStore(testReducer);

// 监听state的变化
const unsubscribe = subscribe(() => {
  // 获取最新的state
  const state = getState();
  console.log('new state:', state);
});

// 发起更新state的动作
dispatch({type: 'increment'});

// 解除监听
unsubscribe();