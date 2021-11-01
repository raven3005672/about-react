// 需要给中间件传入store的API：dispatch，getState
// 需要组合多个中间件增强dispatch
// 中间件的结构
// function middleware({ dispatch, getState }) {
//   return (next) => {
//     return (action) => {
//       // 这个函数可以看做增强后的dispatch
//       return next(action);
//     }
//   }
// }

export default function applyMiddleware(...middlewares) {
  return (createStore) => (reducer) => {
    // 创建store
    const store = createStore(reducer);
    // 增强dispatch
    // 第一步，调用中间件传入dispatch和getState
    const middlewareApi = {
      getState: store.getState,
      dispatch: (action, ...args) => store.dispatch(action, ...args),
    };
    // 调用中间件函数，传入store的api
    // 在middlewareChain中的中间件结构为：(next) => (action) => ...
    const middlewareChain = middlewares.map((middleware) => middleware(middlewareApi));
    // 例如现在有两个中间件 m1, m2
    // 他们在middlewareChain的是这样的
    // function m1(next) => function m1A(action) ...
    // function m2(next) => function m2A(action) ...
    // 将 m2 作为参数传给 m1，将 dispatch 作为参数传给 m2
    // m1(m2(dispatch)) 变为 m1(m2A)
    // m1中的next = m2A（此时m2中的next = dispatch）
    // 当m1中调用next函数，则会执行m2A，m2A中调用next则会调用store中的dispatch方法

    // 使用compose方法（实际就是Array.reduce）返回的函数是这样
    // (dispatch) => m1(m2(dispatch))

    // 使用组合函数，将中间件合并为一个增强后的dispatch函数
    const dispatch = compose(...middlewareChain)(store.dispatch);

    // 返回store的api，以及增强后的dispatch
    return {
      ...store,
      dispatch,
    }
  }
}

// 将多个函数合并为一个函数
function compose(...funcs) {
  // 没有中间件的情况
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  // 只有一个中间件的情况
  if (funcs.length === 1) {
    return funcs[0];
  }
  // 多个中间件的情况
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}