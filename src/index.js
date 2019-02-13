import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Home from './containers/Home'
import commentsReducer from './reducers/comments'
import './index.less'

import ImgList from './containers/ImgList'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// createStore 函数专门生产state和dispatch的集合， 调用后返回state和dispatch
const store = createStore(commentsReducer)

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/photograph" component={ImgList} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
