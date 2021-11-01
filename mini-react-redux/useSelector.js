// useSelector的功能：
// - 需要传入一个以state为参数的回调函数，返回一个指定的state。
// - 监听state的变化，有变化则需要组件强制更新

import { useContext, useEffect, useReducer } from 'react';
import { ReduxContext } from './Provider';

export default function useSelector(selector) {
  // 获取store的api
  const { getState, subscribe } = useContext(ReduxContext);
  // 强制更新
  const [ ignore, forceUpdate ] = useReducer((preValue) => preValue + 1, 0);

  // 监听state的变化
  useEffect(function componentDidMount() {
    const unsubscribe = subscribe(() => {
      forceUpdate();
    });

    return function componentWillUnmount() {
      unsubscribe && unsubscribe();
    }
  }, [subscribe]);

  // 传入state并调用回调函数，返回回调函数指定的state
  return selector(getState());
}
