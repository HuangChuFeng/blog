import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Divider, Icon, message } from 'antd';
import Header from '../../components/Header'
import MyComment from '../../components/Comment'
import { getArticleDetail, commentArticle, addBrowseNum } from "../../service/fetch";
import { changeCurNav } from '../../reducers/common'

class ArticleDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            comments: [],
            article: {},
            curPage: 0,
            clickTypeNum: 0             // 是否可翻页, 0表示可翻页, -1或1表示已经到最底部和最顶部了
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
            let num = this.state.article.browse_num || 0;
            addBrowseNum(this.state.id, num).then(result => {
                const { data } = result;
                if (data) {
                    let article = Object.assign(this.state.article, { browse_num: this.state.article.browse_num + 1 })
                    this.setState({
                        article: article
                    });
                }
            });
        }, 2000);
    }

    componentDidMount() {
        this.articleDetail(this.state.id);
        this.props.changeCurNav('文章详情');
    }

    // 获取某一篇文章及评论
    articleDetail(id, typeNum) {
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
                    })
                    this.context.router.history.push(`/articles/detail/${data.article[0]._id}`);
                    this.handleBrowser();
                }
            }
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
                <Header type="1" />
                <div className="container article-detail-container">
                    <div className="left">
                        <Link to="/articles" onClick={this.backListPage.bind(this)}><Icon type="left" className="back-btn" /></Link>
                        <div className="top-info-box">
                            <h2>{this.state.article.title}</h2>
                            <div className="top-bottom">
                                <span>{date} Beijing</span>
                                <span className="browse-num"><Icon type="fire" className="fire-icon" />{this.state.article.browse_num || 0}</span>
                                
                            </div>
                        </div>
                        <div className="left-bottom-box">
                            <ul className="tag-list">
                                {this.state.article.tags && this.state.article.tags.split(',').map((item, i) => {
                                    return (<li key={i}>{item}</li>)
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
                        <div dangerouslySetInnerHTML={{ __html: this.state.article.content }}></div>
                        <MyComment comments={this.state.comments} onSubmit={this.handleSubmit.bind(this)} />
                    </div>
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

