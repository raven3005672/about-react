// 创建一个redux-logger中间件
export default function logger({display, getState}) {
  return next => action => {
    const preState = getState();  // 获取更新前的state
    console.log('===logger===start');
    console.log('preState: ', preState);
    console.log('action', action);
    const returnValue = next(action); // dispatch action发起更新state
    const nextState = getState(); // 获取更新后的state
    console.log('nextState: ', nextState);
    console.log('===logger===end');
    return returnValue;
  }
}