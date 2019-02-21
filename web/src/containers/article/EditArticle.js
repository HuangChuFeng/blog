import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import EditArticle from '../../components/article/EditArticle'
import '../../css/article.less'

import E from 'wangeditor'

class EditArticleContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        
    }

    loadArticles() {
        this.props.initArticles(this.props.articles);
    }
    render () {
        return (
            <div>
                <Header type="1" />
                <div className="container edit-container">
                    <EditArticle />
                </div>
            </div>
        )
    }
}

// 当前组件需要的state数据
const mapStateToProps = (state) => {
    return {
        // articles: state.articles

        articles: [{
            id: 1,
            type: 0, // 0 原创, 1 分享
            cover_url: '',
            title: 'Koa 框架教程',
            tag: 'koa, node',
            category_id: '',
            publish_time: '2019-01-20 12:00:00',
            description: 'Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有1000多行，所有功能都通过插件实现，很符合 Unix 哲学',
            content: '<p>Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有1000多行，所有功能都通过插件实现，很符合 Unix 哲学。本文从零开始，循序渐进，教会你如何使用 Koa 写出自己的 Web 应用。每一步都有简洁易懂的示例，希望让大家一看就懂。</p>',
            browse_num: 10,
        }]
    }
}
  
// 当前组件需要发起是事件
const mapDispatchToProps = (dispatch) => {
    return {
        initImgs: (imgs) => {
            if(imgs && imgs.length === 0) {
                return fetchImgs(imgs).then(result => {
                    const {data} = result;
                    if (data) {
                        dispatch(initImgs(data.imgs));
                    } 
                });
            } else {
                dispatch(initImgs([]));
            }
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditArticleContainer)