import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import { addArticle } from '../../reducers/articles'
import EditArticle from '../../components/article/EditArticle'
import '../../css/article.less'
import { Button } from 'antd';
import { createArticle } from "../../service/fetch";

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
        console.log(this.props.articles)
        
    }
    // 保存文章 id存在时为编辑状态
    saveArticleHandler() {
        let formData = this.child.getFormData();
        
        if(this.state.articleId) {
            console.log('编辑====: ', formData);
        } else {
            console.log('新建====: ', formData);
        }
        return createArticle(formData).then(result => {
            const {data} = result;
            if (data) {
                this.props.addArticle(data.res);
                this.context.router.history.push(`/articles`);     
            } 
        });
    }

    onRef = (ref) => {
        this.child = ref;
    }
    

    loadArticles() {
        this.props.initArticles(this.props.articles);
    }

    render () {
        return (
            <div>
                <Header type="1" />
                <div className="container edit-container">
                    <EditArticle  
                        onRef={this.onRef}
                        article={this.props.article}/>
                    <Button type="primary" className="common-btn publish-btn" onClick={this.saveArticleHandler.bind(this)}>
                        发布
                    </Button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        articles: state.articlesReducer.articles,

        article: {
            id: 1,
            type: '0', // 0 原创, 1 分享
            cover_url: '',
            title: 'Koa 框架教程',
            tags: 'koa, node',
            category_id: '',
            publish_time: '2019-01-20 12:00:00',
            description: 'Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有1000多行，所有功能都通过插件实现，很符合 Unix 哲学',
            content: '<p>Koa 就是一种简单好用的 Web 框架。它的特点是优雅、简洁、表达力强、自由度高。本身代码只有1000多行，所有功能都通过插件实现，很符合 Unix 哲学。本文从零开始，循序渐进，教会你如何使用 Koa 写出自己的 Web 应用。每一步都有简洁易懂的示例，希望让大家一看就懂。</p>',
            browse_num: 10,
        }
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