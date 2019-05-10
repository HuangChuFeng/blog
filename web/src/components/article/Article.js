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
        editArticle: PropTypes.func,
        viewDetail: PropTypes.func,
        isAdmin: PropTypes.bool
    }

    render() {
        let article = this.props.article;
        return (
            <div className="article-wraper">
                <div className={["cover-box", (!article.cover_url ? 'no-cover' : '')].join(' ') }>
                    <img v-if={article.cover_url} src={article.cover_url} alt=""/>
                </div>
                <h3 className="title">
                    <p onClick={this.props.viewDetail.bind(this, article._id)}>{ article.title }</p>
                    { this.props.isAdmin &&
                        <span className="operate-btn">
                            <Icon type="delete" onClick={this.props.deleteArticle.bind(this, article._id, this.props.index)}/>
                            <Icon type="edit" onClick={this.props.editArticle.bind(this, article._id)}/>
                        </span>
                     }
                </h3>
                <p className="time">{ article.created_at }
                    <span><Icon type="message" className="icon"/>{ article.comments || 0 }</span>
                    <span><Icon type="fire" className="icon"/>{ article.pv || 0 }</span>
                </p>
                <div className="description">{ article.description }</div>
            </div>
        )
    }
}

