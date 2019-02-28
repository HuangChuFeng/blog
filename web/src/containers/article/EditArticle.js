import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import { addArticle } from '../../reducers/articles'
import EditArticle from '../../components/article/EditArticle'
import '../../css/article.less'
import { Button, Icon } from 'antd';
import { createArticle, updateArticleById } from "../../service/fetch";

class EditArticleContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articleId: this.props.match.params.id,
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    componentDidMount() {
        
    }
    // 保存文章 id存在时为编辑状态
    saveArticleHandler() {
        let formData = this.child.getFormData();
        
        if(this.state.articleId) {
            console.log('编辑====: ', formData);
            updateArticleById(this.state.articleId, formData).then(result => {
                const {data} = result;
                if (data) {
                    // this.props.addArticle(data.res);
                    this.context.router.history.push(`/articles`);     
                } 
            });
        } else {
            console.log('新建====: ', formData);
            createArticle(formData).then(result => {
                const {data} = result;
                if (data) {
                    this.props.addArticle(data.res);
                    this.context.router.history.push(`/articles`);     
                } 
            });
        }
    }

    onRef = (ref) => {
        this.child = ref;
    }

    render () {
        return (
            <div>
                <Header type="1" />
                <div className="container edit-container">        
                    <EditArticle  
                        onRef={this.onRef}
                        article={this.props.article}/>
                    <Button type="primary" className="common-btn operate-btn" onClick={this.saveArticleHandler.bind(this)}>
                        发布
                    </Button>
                    <Button className="operate-btn"><Link to="/articles">取消</Link></Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        articles: state.articlesReducer.articles,
        article: state.articlesReducer.curArticle,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addArticle: (article) => {
            dispatch(addArticle(article));
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditArticleContainer)