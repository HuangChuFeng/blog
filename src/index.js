import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Home from './containers/Home'
// import CommentApp from './containers/CommentApp'
import commentsReducer from './reducers/comments'
import './index.less'


// createStore 函数专门生产state和dispatch的集合， 调用后返回state和dispatch
const store = createStore(commentsReducer)

ReactDOM.render(
  <Provider store={store}>
    <Home />
  </Provider>,
  document.getElementById('root')
);
