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
            id: this.props.match.params.id
        }
    }
    static propTypes = {
        artilceId: PropTypes.number,
    }

    componentDidMount() {
        console.log(this.props.article)
    }

    render() {
        let date = this.props.article.created_at.split(' ')[0].split('-');
        let year = date[0], time = date[1] + ' ' + date[2];
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
                                <span className="browse-num"><Icon type="fire" className="fire-icon" />{ this.props.article.browse_num }</span>
                                <ul className="tag-list">
                                    { this.props.article.tags.split(',').map((item, i) => {
                                        return (<li key={i}>{ item }</li>)
                                    }) }
                                </ul>
                            </div>
                        </div>
                        <div className="left-bottom-box">
                            <h3>{ this.props.article.title }</h3>
                            { this.props.article.description } 
                        </div>
                        <div className="control-box">
                            <span>上一篇</span>
                            <span>下一篇</span>
                        </div>
                    </div>
                    <div className="right">
                        <div dangerouslySetInnerHTML={{__html: this.props.article.content }}></div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        article: state.articlesReducer.curArticle,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // addArticle: (article) => {
        //     dispatch(addArticle(article));
        // }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ArticleDetail)

