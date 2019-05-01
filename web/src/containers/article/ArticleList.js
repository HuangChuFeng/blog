import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ArticleList from '../../components/article/ArticleList'
import Header from '../../components/Header'
import { initArticles, deleteArticle } from '../../reducers/articles'
import { changeCurNav } from '../../reducers/common'
import '../../css/article.less'

import { fetchArticles, deleteArticleById } from "../../service/fetch";


class ArticleListContainer extends Component {

    componentWillMount() {
        this.props.initArticles();
        if(!this.props.curNav) {
            this.props.changeCurNav('所有文章')
        }
    }
    static contextTypes = {
        router: PropTypes.object.isRequired,
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
        this.context.router.history.push(`/articles/edit/${articleId}`);
    }

    onViewDetail = (articleId) => {
        this.context.router.history.push(`/articles/detail/${articleId}`);
    }

    render () {
        return (
            <div>
                <Header type={1} formParentNav="所有文章"/>
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
        articles: state.articlesReducer.articles,
        curNav: state.commonReducer.curNav
    }
}
  
// 当前组件需要发起的事件
const mapDispatchToProps = (dispatch) => {
    return {
        initArticles: () => {
            fetchArticles().then(result => {
                const { data } = result;
                if (data) {
                    dispatch(initArticles(data.articles));
                } 
            });
            
        },
        deleteArticle: (articleId) => {
            dispatch(deleteArticle(articleId));
        },
        changeCurNav: (nav) => {
            dispatch(changeCurNav(nav));
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleListContainer)