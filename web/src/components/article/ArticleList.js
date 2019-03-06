import React, { Component } from 'react'
import Article from '../article/Article'
import PropTypes from 'prop-types'
export default class ArticleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    // 对父组件传入的props数据进行类型检测
    static propTypes = {
        articles: PropTypes.array,
        deleteArticle: PropTypes.func,
        editArticle: PropTypes.func,
        viewDetail: PropTypes.func,
    }

    // 声明变量, 初始化默认值
    static defaultProps = {
        articles: [],
    }

    render() {
        return (
            <div>
                <div className="left">
                    {this.props.articles.map((article, i) =>
                    <Article
                        article={article}
                        key={article._id}
                        index={i} 
                        deleteArticle={this.props.deleteArticle.bind(this)}
                        editArticle={this.props.editArticle.bind(this)}
                        viewDetail={this.props.viewDetail.bind(this)}
                        />
                    )}
                </div>
                {/* <div className="right">
                    <img className="avator" src={require('../../static/img/avator.jpeg')} />
                </div> */}
            </div>
        )
    }
}

