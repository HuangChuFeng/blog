import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { BackTop, Spin } from 'antd';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ArticleList from '../../components/article/ArticleList'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Loading from '../../components/Loading'
import { initArticles, deleteArticle } from '../../reducers/articles'
import { changeCurNav } from '../../reducers/common'
import '../../css/article.less'

import { fetchArticles, deleteArticleById, getArticlesByTagName } from "../../service/fetch";

class ArticleListContainer extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            showLoading: false,
            pageNum: 1,
            pageSize: 10,
            noMore: true,  // 是否没有更多了
        }
    }

    componentWillMount() {
        let search = this.context.router.route.location.search;
        let type = search.substring(search.length-1);
        let tag = this.props.match.params.tag;
        if(type) {
            this.loadArticles(type);
            let curNav = (type === '0' ? '笔记' : '生活');
            this.props.changeCurNav(curNav)
            
        } else {
            // 按标签获取
            if(tag) {
                this.props.getArticlesByTagName(tag);
            } else {
                this.loadArticles();
            }
            if(!this.props.curNav) {
                this.props.changeCurNav('所有文章')
            }
        }
    }

    loadArticles(type = '') {
        let params = {
            pageNum: this.state.pageNum,
            pageSize: this.state.pageSize,
            type,
        }
        if(params.pageNum === 1) {
            this.setState({ loading: true })
            this.props.initArticles([], this.state.pageNum);
        } else {
            this.setState({ showLoading: true });
        }
        fetchArticles(params).then(result => {
            const { data } = result;
            if (data) {
                this.props.initArticles(data.articles, this.state.pageNum);
                this.setState({ 
                    showLoading: false,
                    loading: false
                })
                if(data.allCount <= params.pageNum * params.pageSize) {
                    this.setState({ noMore: true })
                } else {
                    this.setState({ noMore: false })
                }
            } else {
                this.setState({ 
                    showLoading: false,
                    loading: false,
                    noMore: true
                });
            }
        })
    }

    loadMore() {
        this.setState({ pageNum: this.state.pageNum + 1 }, function () {
            this.loadArticles();
        })
    }

    handleNavChange(type) {
        this.setState({ pageNum: 1 }, () => {
            this.loadArticles(type);
        })
    }

    onDeleteArticle(articleId, index, url) {
        let coverName = ''
        if(url) {
        url = url.split('/');
            coverName = url[url.length - 1];
        }
        deleteArticleById({articleId, coverName}).then(result => {
            const { data } = result;
            if (data) {
                this.props.deleteArticle(index);
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
                <Header
                    type={1}
                    formParentNav="所有文章"
                    handleNavChange={this.handleNavChange.bind(this)}/>
                <div className="container article-container">
                    { this.props.isAdmin && 
                    <Link to='/articles/new'>写文章</Link>
                    }
                    <Spin spinning={this.state.loading}>
                        <div>
                            <ArticleList 
                                articles= {this.props.articles} 
                                deleteArticle={this.onDeleteArticle.bind(this)}
                                editArticle={this.onEditArticle.bind(this)}
                                viewDetail={this.onViewDetail.bind(this)}
                                isAdmin={this.props.isAdmin}
                            />
                            { !this.state.noMore &&
                            <Loading 
                                show={this.state.showLoading}
                                loadMore={this.loadMore.bind(this)}
                            />
                        }
                        </div>
                    </Spin>
                    <BackTop target={() => document.getElementsByClassName('container')[0]} />
                    <Footer />
                </div>
            </div>
        )
    }
}

// 当前组件需要的state数据
const mapStateToProps = (state) => {
    return {
        articles: state.articlesReducer.articles,
        curNav: state.commonReducer.curNav,
        isAdmin: state.commonReducer.isAdmin
    }
}
  
// 当前组件需要发起的事件
const mapDispatchToProps = (dispatch) => {
    return {
        initArticles: (articles, pageNum) => {
            dispatch(initArticles(articles, pageNum));
        },
        getArticlesByTagName: (tag) => {
            getArticlesByTagName(tag).then(result => {
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