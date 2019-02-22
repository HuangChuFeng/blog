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
        onClickArticle: PropTypes.func,
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
                <h3 className="title" onClick={this.toArticleDetailPage.bind(this, this.props.article.id)}><a herf="#">{ article.title }</a></h3>
                <p className="time">{ article.publish_time }
                    <span className="browse-num"><Icon type="fire" className="fire-icon" />{ article.browse_num }</span>
                </p>
                <div className="description">{ article.description }</div>
            </div>
        )
    }
}

