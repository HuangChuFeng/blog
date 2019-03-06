import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ArticleList from '../../components/article/ArticleList'
import Header from '../../components/Header'
import { Affix, Menu, Dropdown, Icon } from 'antd';
import { initArticles, deleteArticle, getArticleById } from '../../reducers/articles'
import { Button } from 'antd';
import '../../css/article.less'

import { fetchArticles, deleteArticleById } from "../../service/fetch";


class ArticleListContainer extends Component {

    componentWillMount() {
        if(this.props.articles && this.props.articles.length == 0) {
            this.loadArticles();
        }
    }
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    loadArticles() {
        fetchArticles().then(result => {
            const { data } = result;
            if (data) {
                this.props.initArticles(data.articles);
            } 
        });
    }

    onDeleteArticle(articleId, index) {
        deleteArticleById({articleId: articleId}).then(result => {
            console.log(this.props)
            const { data } = result;
            if (data) {
                this.props.deleteArticle(index);
                console.log(data.message, this.props.articles);
            } 
        })
    }    

    onEditArticle = (articleId) => {
        this.props.getArticleById(articleId);
        this.context.router.history.push(`/articles/edit/${articleId}`);
    }

    onViewDetail = (articleId) => {
        this.props.getArticleById(articleId);
        this.context.router.history.push(`/articles/detail/${articleId}`);
    }

    render () {
        return (
            <div>
                <Header type="1" />
                <div className="container article-container">
                    <Link to='/articles/new'>写文章</Link>
                    <ArticleList 
                        articles= {this.props.articles} 
                        deleteArticle={this.onDeleteArticle.bind(this)}
                        editArticle={this.onEditArticle.bind(this)}
                        viewDetail={this.onViewDetail.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

// 当前组件需要的state数据
const mapStateToProps = (state) => {
    return {
        articles: state.articlesReducer.articles

        // articles: [{
        //     id: 1,
        //     type: 0, // 0 原创, 1 分享
        //     cover_url: '',
        //     title: 'Koa 框架教程',
        //     tags: 'koa, node',
        //     category_id: '',
        //     publish_time: '2019-01-20 12:00:00',
        //     description: 'Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有1000多行，所有功能都通过插件实现，很符合 Unix 哲学',
        //     content: '<p>Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有1000多行，所有功能都通过插件实现，很符合 Unix 哲学。本文从零开始，循序渐进，教会你如何使用 Koa 写出自己的 Web 应用。每一步都有简洁易懂的示例，希望让大家一看就懂。</p>',
        //     browse_num: 10,
        // }]
    }
}
  
// 当前组件需要发起是事件
const mapDispatchToProps = (dispatch) => {
    return {
        initArticles: (articles) => {
            dispatch(initArticles(articles));
        },
        deleteArticle: (articleId) => {
            dispatch(deleteArticle(articleId));
        },
        getArticleById: (articleId) => {
            dispatch(getArticleById(articleId));
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleListContainer)