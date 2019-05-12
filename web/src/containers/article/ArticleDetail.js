import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, message, Spin } from 'antd';
import Header from '../../components/Header'
import MyComment from '../../components/Comment'
import { getArticleDetail, comment as commentArticle, addArticlePv } from "../../service/fetch";
import { changeCurNav } from '../../reducers/common'
import Highlight from 'react-highlight'
import 'highlight.js/styles/hopscotch.css'

// atom-one-dark-reasonable
// gruvbox-dark
// hopscotch

class ArticleDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            id: this.props.match.params.id,
            comments: [],
            article: {},
            curPage: 0,
            clickTypeNum: 0,             // 是否可翻页, 0表示可翻页, -1或1表示已经到最底部和最顶部了
            tags: [],
        }
    }
    static propTypes = {
        artilceId: PropTypes.number,
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    handleBrowser() {
        setTimeout(() => {
            addArticlePv(this.state.id).then(result => {
                const { data } = result;
                if (data) {
                    let article = Object.assign(this.state.article, { pv: (this.state.article.pv || 0) + 1 })
                    this.setState({
                        article: article
                    });
                }
            });
        }, 2000);
    }

    componentWillMount() {
        this.articleDetail(this.state.id);
        this.props.changeCurNav('文章详情');
    }

    // 获取某一篇文章及评论
    articleDetail(id, typeNum = '') {
        this.setState({ loading: true });
        getArticleDetail(id, typeNum).then(result => {
            const { data } = result;
            if (data) {
                if (data.noMore) {
                    message.warning('已经是最后一篇了', 1);
                    this.setState({ clickTypeNum: typeNum })
                } else {
                    this.setState({
                        article: data.article[0],
                        id: data.article[0]._id,
                        clickTypeNum: 0,
                        comments: data.comment,
                        tags: data.tags
                    })
                    this.context.router.history.push(`/articles/detail/${data.article[0]._id}`);
                    this.handleBrowser();
                }
            }
            this.setState({ loading: false });
        });
    }

    // 上一篇or上一篇
    lastOrNextArticle = (typeNum) => {
        this.articleDetail(this.state.id, typeNum);
    }

    // 发表评论
    handleSubmit = (comment, cb) => {
        commentArticle(this.state.id, comment).then(result => {
            if (result) {
                cb && cb(result);
            }
        });
    }
    // 返回列表页
    backListPage = () => {
        this.props.changeCurNav('')
    }

    render() {
        let date;
        if (this.state.article.created_at) {
            date = this.state.article.created_at.replace(/-/g, '.');
        }
        return (
            <div>
                <Header type={1} />
                <div className="container article-detail-container">
                    <Spin spinning={this.state.loading}>
                    <div className="left">
                        <Link to="/articles" onClick={this.backListPage.bind(this)}><Icon type="left" className="back-btn" /></Link>
                        <div className="top-info-box">
                            <h2>{this.state.article.title}</h2>
                            <div className="top-bottom">
                                <span>{date} Beijing</span>
                                <span className="browse-num"><Icon type="fire" className="fire-icon" />{this.state.article.pv || 0}</span>
                                
                            </div>
                        </div>
                        <div className="left-bottom-box">
                            <ul className="tag-list">
                                {this.state.tags && this.state.tags.map(item => {
                                    return (<li key={item._id}>{item.name}</li>)
                                })}
                            </ul>
                            {this.state.article.description}
                        </div>
                        <div className="control-box">
                            <span onClick={this.lastOrNextArticle.bind(this, -1)}>上一篇</span>
                            <span onClick={this.lastOrNextArticle.bind(this, 1)}>下一篇</span>
                        </div>
                    </div>
                        <div className="right">
                            <Highlight className='language-name-of-snippet' innerHTML={true}>
                                {this.state.article.content}
                            </Highlight>
                            {/* <div dangerouslySetInnerHTML={{ __html: this.state.article.content }}></div> */}
                            <MyComment 
                                receiver={this.state.article.author}
                                comments={this.state.comments} 
                                onSubmit={this.handleSubmit.bind(this)} 
                            />
                        </div>
                    </Spin>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        curArticle: state.articlesReducer.curArticle,
        articles: state.articlesReducer.articles,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeCurNav: (nav) => {
            dispatch(changeCurNav(nav));
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleDetail)

