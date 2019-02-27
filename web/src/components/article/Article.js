import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Icon } from 'antd';

export default class Article extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    static propTypes = {
        article: PropTypes.object,
        index: PropTypes.number,
        deleteArticle: PropTypes.func,
    }

    // 查看图片详情
    toArticleDetailPage = id =>  {
        this.context.router.history.push(`/articles/${id}`);       
    }

    render() {
        let article = this.props.article;
        return (
            <div className="article-wraper">
                <div className="cover-box">
                    <img src={require('../../static/img/img15.jpg')} alt=""/>
                </div>
                <h3 className="title">
                    <a herf="#" onClick={this.toArticleDetailPage.bind(this, this.props.article.id)}>{ article.title }</a>
                    <span className="remove-btn" onClick={this.props.deleteArticle.bind(this, article._id, this.props.index)}>删除</span>
                </h3>
                <p className="time">{ article.created_at }
                    <span className="browse-num"><Icon type="fire" className="fire-icon" />{ article.browse_num || 0 }</span>
                </p>
                <div className="description">{ article.description }</div>
            </div>
        )
    }
}

