Redux共有6部分组成：

- store：保存应用的状态
- state：应用的状态
- action：拥有一个type属性的对象，表示改变state的意图
- dispatch：接收一个action发送至store
- reducer：Reducer是个纯函数,它接收上一次的state和action，通过上一次的state和action中的数据重新计算出新的state进行返回更新。
- middleware：中间件，它的作用是通过高阶函数对dispatch进行组合，返回一个增强的dispatch函数

那么它们之间是如何工作的呢？

- 首次启动
  - 使用root reducer函数为参数创建store
  - store调用一次root reducer，并将它返回的值保存为初始的state
  - 当UI首次渲染的时候，UI组件会从store中拿出state，根据state来渲染界面。同时会对store进行监听，以便知道state是否有变化，有的话，则会根据新的state更新界面。
- 更新
  - 当用户与UI进行交互，如：点击事件
  - dispatch一个action到store，如：dispatch({type: "increment"})
  - store会用之前的state和当前的action再次运行reducer，将返回值保存为新的state
  - store会通知所有订阅过的UI，告诉它们state有新的变化
  - 当订阅过的UI收到通知，则从store中重新获取state更新界面
