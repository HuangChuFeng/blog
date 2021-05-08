import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import Home from './containers/Home'
import reducer from './reducers/index'
import 'lib-flexible'
import './index.less'
import ReactMarkdown from 'react-markdown';

import ImgList from './containers/photograph/ImgList'
import ImgDetail from './containers/photograph/ImgDetail'
import Group from './containers/photograph/Group'
import ArticleList from './containers/article/ArticleList'
import ArticleDetail from './containers/article/ArticleDetail'
import EditArticle from './containers/article/EditArticle'
import ArticlesTags from './containers/article/Tags'
import Music from './components/Music'
import About from './components/About'

import {HashRouter as Router, Route } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import CodeBlock from './components/article/MarkDown';
import mdFile from './static/test.md';

// createStore 函数专门生产state和dispatch的集合， 调用后返回state和dispatch
const store = createStore(reducer);
console.log('NODE_ENV', process.env.NODE_ENV);

const testFile = `## API
### PreviewLayout

| 参数     | 说明                       | 类型 | 默认值 | 版本  |
| :------- | :------------------------- | :--: | :----: | :---: |
| children | 传递的组件，可以是任意组件 | jsx  |  null  | 0.1.0 |
`

ReactDOM.render(
  <ReactMarkdown
    source={testFile}
    escapeHtml={false}
    renderers={{
        code: CodeBlock,
    }}
  />,
  // <Provider store={store}>
  //   <div>
  //     <Music />
  //     <Router>
  //       <div>
  //         <Route exact path="/" component={Home} />
  //         <Route exact path="/about" component={About} />
  //         <Route exact path="/photograph" component={ImgList} />
  //         <Route exact path="/photograph/detail/:id" component={ImgDetail} />
  //         <Route exact path="/photograph/group/:id" component={Group} />
  //         <Route exact path="/articles" component={ArticleList} />
  //         <Route exact path="/articles/detail/:id" component={ArticleDetail} />
  //         <Route exact path="/articles/new" component={EditArticle} />
  //         <Route exact path="/articles/edit/:id" component={EditArticle} />
  //         <Route exact path="/articles/tags" component={ArticlesTags} />
  //         <Route exact path="/articles/tags/:tag" component={ArticleList} />
  //         <ToastContainer />
  //       </div>
  //     </Router>
  //   </div>
  // </Provider>,
  document.getElementById('root')
);
