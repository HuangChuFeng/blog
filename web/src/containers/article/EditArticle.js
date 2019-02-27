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
        console.log(this.props.article)
        
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