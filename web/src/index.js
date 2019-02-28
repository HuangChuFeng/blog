import React from 'react'
import ReactDOM from 'react-dom'
import { combineReducers, createStore } from 'redux'
import { Provider } from 'react-redux'
import Home from './containers/Home'
import reducer from './reducers/index'
import './index.less'

import ImgList from './containers/photograph/ImgList'
import ImgDetail from './containers/photograph/ImgDetail'
import ArticleList from './containers/article/ArticleList'
import ArticleDetail from './containers/article/ArticleDetail'
import EditArticle from './containers/article/EditArticle'

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// createStore 函数专门生产state和dispatch的集合， 调用后返回state和dispatch
const store = createStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/photograph" component={ImgList} />
        <Route exact path="/photograph/:id" component={ImgDetail} />
        <Route exact path="/articles" component={ArticleList} />
        <Route exact path="/articles/detail/:id" component={ArticleDetail} />
        <Route exact path="/articles/new" component={EditArticle} />
        <Route exact path="/articles/edit/:id" component={EditArticle} />
      </div>
    </Router>
  </Provider>,
  document.getElementById('root')
);
