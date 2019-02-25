import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import { addArticle } from '../../reducers/articles'
import EditArticle from '../../components/article/EditArticle'
import '../../css/article.less'
import { createArticle } from "../../service/fetch";

import E from 'wangeditor'

class EditArticleContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleId: this.props.match.params.id,
        }
    }
    componentDidMount() {
        
    }
    // 保存文章 id存在时为编辑状态
    saveArticleHandler(formData) {
        if(this.state.articleId) {
            console.log('新建====: ', formData);
        } else {
            console.log('编辑====: ', formData);
            
        }
        // return createArticle(formData).then(result => {
        //     const {data} = result;
        //     if (data) {
                console.log(this.props)
        //         this.props.addArticle(data.res);
        //     } 
        // });
    }

    loadArticles() {
        this.props.initArticles(this.props.articles);
    }

    render () {
        return (
            <div>
                <Header type="1" />
                <div className="container edit-container">
                    <EditArticle 
                        article={this.props.article}
                        onSaveArticle={this.saveArticleHandler}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        // articles: state.articles

        article: {
            id: 1,
            type: '0', // 0 原创, 1 分享
            cover_url: '',
            title: 'Koa 框架教程',
            tags: 'koa, node',
            category_id: '',
            publish_time: '2019-01-20 12:00:00',
            description: 'Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有1000多行，所有功能都通过插件实现，很符合 Unix 哲学',
            content: '<p>Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有1000多行，所有功能都通过插件实现，很符合 Unix 哲学。本文从零开始，循序渐进，教会你如何使用 Koa 写出自己的 Web 应用。每一步都有简洁易懂的示例，希望让大家一看就懂。</p>',
            browse_num: 10,
        }
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addArticle: (article) => {
            dispatch(addArticle(article));
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditArticleContainer)