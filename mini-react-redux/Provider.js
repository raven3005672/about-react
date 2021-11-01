// Provider是一个组件，它通过将store赋值给value属性，进行跨层级传递store的api。

import React from 'react';

export const ReduxContext = React.createContext();

export default function Provider({store, children}) {
  return (
    <ReduxContext.Provider value={store}>
      {children}
    </ReduxContext.Provider>
  )
}