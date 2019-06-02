import React, { Component } from 'react'
import Article from '../article/Article'
import PropTypes from 'prop-types'
import { Icon } from 'antd';
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
        isAdmin: PropTypes.bool
    }

    // 声明变量, 初始化默认值
    static defaultProps = {
        articles: [],
    }

    render() {
        return (
            <div>
                <div className="left">
                    { this.props.articles.length > 0 &&
                        <div>
                            {this.props.articles.map((article, i) =>
                            <Article
                                article={article}
                                key={article._id}
                                index={i} 
                                deleteArticle={this.props.deleteArticle.bind(this)}
                                editArticle={this.props.editArticle.bind(this)}
                                viewDetail={this.props.viewDetail.bind(this)}
                                isAdmin={this.props.isAdmin}
                                />
                            )}
                        </div>
                    }
                    { this.props.articles.length === 0 &&
                        <div style={{textAlign: 'center'}}>暂无数据</div>
                    }
                </div>
                <div className="right">
                    <img className="avator" alt="" src={require('../../static/img/avator.jpeg')} />
                    <div>
                        <p>麻烦让我一夜暴富<br/>实在不行的话<br/>半个月也可以<br/>一年也可以</p>
                        <br/>
                        <p>好好学习, 天天向上</p>
                        <p><a target="blank" href="https://github.com/HuangChuFeng"><Icon type="github" /> <span>github</span></a></p>
                        <p><a target="blank" href="https://weibo.com/5454891945/profile"><Icon type="weibo-circle" /> <span>__cranky</span></a></p>
                    </div>
                </div>
            </div>
        )
    }
}

