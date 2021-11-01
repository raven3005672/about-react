// connect是个高阶函数，我们先来分析一下connect的功能：
// - 将React的组件与Redux的store进行连接，可以将state，dispatch等属性传递给React组件
// - 监听state的变化，有变化则会让组件强制更新，根据最新的state重新渲染。

// function connect(
//   mapStateToProps,
//   mapDispatchToProps,
//   mergeProps,
//   options,
// )

// mapStateToProps?: (state, ownProps?) => Object
// 可以看到mapStateToProps是个函数，接收store的state，和父组件传递的props(ownProps)作为参数，返回一个对象，这个对象会被传递给react组件的props中


// mapDispatchToProps?: Object | (dispatch, ownProps?) => Object
// 可以看到mapDispatchToProps可以是一个对象，也可以是一个函数。 当是函数时，接收store的dispatch方法作为第一个参数，父组件传递的props(ownProps)作为第二个参数，返回的对象会被传递给react组件的props中：
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     add: dispatch({type: 'add'})
//   }
// }
// 传递对象时，这个对象会被传递给react组件的props中
// mapDispatchToProps = {
//   add: () => ({type: 'add'})
// }


import { useContext, useEffect, useReducer } from 'react';
import { ReduxContext } from './Provider';

// 对action对象使用dispatch进行封装，传递给组件课直接调用，不用再单独调用dispatch方法
function bindActionCreators(actionCreators, dispatch) {
  const boundActionCreators = { dispatch };

  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    boundActionCreators[key] = (...args) => dispatch(actionCreator(...args));
  }
}

// connect接收两个参数，mapStateToProps，mapDispatchToProps
const connect = (mapStateToProps, mapDispatchToProps) => {
  // connect是个高阶函数，需要返回一个接收组件作为参数，返回一个新的组件的函数
  const wrapWithConnect = WrappedComponent => props => {
    // 获取store的api
    const { getState, subscribe, dispatch } = useContext(ReduxContext);
    const [ ignore, forceUpdate ] = useReducer((preValue) => preValue + 1, 0);
    // 获取state
    const state = getState();
    // 调用mapStateToProps
    const stateProps = mapStateToProps && mapStateToProps(state, props);
    let dispatchProps = { dispatch };

    // 判断mapDispatchToProps的类型，是函数还是对象
    if (typeof(mapDispatchToProps) === 'function') {
      dispatchProps = mapDispatchToProps(dispatch, props);
    } else if (mapDispatchToProps && typeof(mapDispatchToProps) === 'object') {
      dispatchProps = bindActionCreators(mapDispatchToProps, dispatch);
    }

    // 监听state的变化，有变化调用forceUpdate进行强制刷新
    useEffect(function componentDidMount() {
      const unsubscribe = subscribe(() => {
        forceUpdate();
      });
      return function componentWillUnmount() {
        unsubscribe && unsubscribe();
      }
    }, [subscribe]);

    return <WrappedComponent { ... props } { ...stateProps } { ...dispatchProps }></WrappedComponent>
  }
}
