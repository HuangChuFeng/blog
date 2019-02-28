import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Divider, Icon } from 'antd';
import Header from '../../components/Header'

class ArticleDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            article: this.props.curArticle,
        }
    }
    static propTypes = {
        artilceId: PropTypes.number,
    }

    componentDidMount() {
        console.log(this.props.article)
    }

    // 上一篇
    lastArticle = () => {
        let index = this.props.curArticle.index > 0 ? this.props.curArticle.index - 1 : 0;
        this.setState({ 
            article: this.props.articles[index]
        })
    }

    // 下一篇
    nextArticle = () => {
        let index = this.props.curArticle.index < this.props.articles.length - 1 ? this.props.curArticle.index + 1 : this.props.curArticle.index;
        this.setState({ 
            article: this.props.articles[index]
        })
    }

    render() {
        let date = this.state.article.created_at.split(' ')[0].split('-');
        let year = date[0], time = date[1] + '. ' + date[2];
        return (
            <div>
                <Header type="1" />
                <div className="container article-detail-container">
                    <div className="left">
                        <Link to="/articles"><Icon type="left" className="back-btn"/></Link>                    
                        <div className="top-info-box">
                            <h1>{ year }</h1>
                            <div className="top-bottom">
                                <span>{ time } Beijing</span>
                                <span className="browse-num"><Icon type="fire" className="fire-icon" />{ this.state.article.browse_num }</span>
                                <ul className="tag-list">
                                    { this.state.article.tags.split(',').map((item, i) => {
                                        return (<li key={i}>{ item }</li>)
                                    }) }
                                </ul>
                            </div>
                        </div>
                        <div className="left-bottom-box">
                            <h3>{ this.state.article.title }</h3>
                            { this.state.article.description } 
                        </div>
                        <div className="control-box">
                            <span onClick={this.lastArticle.bind(this)}>上一篇</span>
                            <span onClick={this.nextArticle.bind(this)}>下一篇</span>
                        </div>
                    </div>
                    <div className="right">
                        <div dangerouslySetInnerHTML={{__html: this.state.article.content }}></div>
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

