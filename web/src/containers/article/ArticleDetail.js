import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Divider, Icon, message } from 'antd';
import Header from '../../components/Header'
import MyComment from '../../components/Comment'
import { getArticleDetail, commentArticle } from "../../service/fetch";

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

    componentWillMount() {
        if (this.props.curArticle) {
            this.setState({
                article: this.props.curArticle,
                curPage: this.props.curArticle.index,
            })
        } else {
            this.articleDetail(this.state.id);
        }
    }

    // 获取某一篇文章及评论
    articleDetail(id, typeNum) {
        getArticleDetail(id, typeNum).then(result => {
            const { data } = result;
            if (data) {
                if (data.article.length === 0) {
                    message.warning('已经是最后一篇了', 1);
                    this.setState({ clickTypeNum: typeNum })
                } else {
                    this.setState({
                        article: data.article[0],
                        id: data.article[0]._id,
                        clickTypeNum: 0,
                    })
                    this.context.router.history.push(`/articles/detail/${data.article[0]._id}`);
                }
            }
        })
    }

    // 上一篇or上一篇
    lastOrNextArticle = (typeNum) => {
        if (this.state.clickTypeNum === typeNum) return;
        if (this.props.curArticle) {
            let flag = this.state.clickTypeNum, index = 0;
            if (typeNum === -1) {                   // 上一篇
                index = this.state.curPage > 0 ? this.state.curPage - 1 : 0;
            } else if (typeNum === 1) {             // 下一篇
                index = this.state.curPage < this.props.articles.length - 1 ? this.state.curPage + 1 : this.state.curPage;
            }

            if (index === 0 || index === this.props.articles.length - 1) {
                flag = 0;
            }
            this.setState({
                article: this.props.articles[index],
                curPage: index,
                clickTypeNum: flag
            })
            this.context.router.history.push(`/articles/detail/${this.props.articles[index]._id}`);
        } else {
            this.articleDetail(this.state.id, typeNum);
        }
    }

    // 发表评论
    handleSubmit = (comment) => {
        console.log(comment);
        commentArticle(this.state.id, comment).then(result => {
            const { data } = result;
            console.log(data);
            
            if (data) {
                
            }
        });
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
                        <Link to="/articles"><Icon type="left" className="back-btn" /></Link>
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleDetail)

