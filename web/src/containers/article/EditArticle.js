import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import { setCurArticle, addArticle, updateArticle, initTags } from '../../reducers/articles'
// import EditArticle from '../../components/article/EditArticle'
import '../../css/article.less'
import { Button, Icon } from 'antd';
import { getArticleDetail, createArticle, updateArticleById, getTags } from "../../service/fetch";

import WrappedArticleForm from '../../components/article/EditForm'
import EditContent from '../../components/article/EditContent'

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

    async componentDidMount() {
        await this.props.articleDetail(this.state.articleId);
        this.props.initTags();       
    }
    
    // 保存文章 id存在时为编辑状态
    saveArticleHandler() {
        console.log(this.child.getContent());
        
        let formData = this.child.getFormData();
        
        if(this.state.articleId) {
            console.log('编辑====: ', formData);
            updateArticleById(this.state.articleId, formData).then(result => {
                const {data} = result;
                if (data) {
                    this.props.updateArticle(Object.assign(formData, { _id: this.state.articleId }));
                    this.context.router.history.push(`/articles`);     
                }
            });
        } else {
            console.log('新建====: ', formData);
            createArticle(formData).then(result => {
                const {data} = result;
                if (data) {
                    // this.props.addArticle(data.res);
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
                    <WrappedArticleForm 
                        article={this.props.curArticle}
                        tags={this.props.tags}
                        onRef={this.onRef} />

                    <EditContent onRef={this.onRef} article={this.props.curArticle} />
                    {/* <EditArticle
                        onRef={this.onRef}
                        article={this.state.article}/> */}
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
        curArticle: state.articlesReducer.curArticle,
        tags: state.articlesReducer.tags,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addArticle: (article) => {
            dispatch(addArticle(article));
        },
        updateArticle: (article) => {
            dispatch(updateArticle(article))
        },
        initTags: () => {
            getTags().then(result => {
                const { data } = result;
                if (data) {
                    dispatch(initTags(data.tags));
                } 
            });
        },
        articleDetail(id) {
            return getArticleDetail(id).then(result => {
                const { data } = result;
                if (data) {
                    dispatch(setCurArticle(data.article[0]));
                }
            });
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditArticleContainer)