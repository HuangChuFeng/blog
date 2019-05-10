import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import { setCurArticle, initTags } from '../../reducers/articles'
import '../../css/article.less'
import { Button } from 'antd';
import { getArticleDetail, createArticle, updateArticleById, getTags, uploadImg } from "../../service/fetch";
import EditForm from '../../components/article/EditForm'
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
        if (this.state.articleId) {
            await this.props.articleDetail(this.state.articleId);
        }
        this.props.initTags();
    }

    componentWillUnmount() {
        this.props.resetCurArticle();
    }

    uploadCover(data, cb) {
        const formData = new FormData();
        formData.append(data.filename, data.file);
        uploadImg(formData).then(res => {
            if (res.data.resCode === 200) {
                cb && cb(res)
                
            }
        })
    }

    // 保存文章 id存在时为编辑状态
    saveArticleHandler() {
        let formData = this.form.getFormData();
        if(!formData) {
            return;
        }
        formData = Object.assign(this.child.getContent(), formData);
        if (this.state.articleId) {
            // console.log('编辑====: ', formData);
            updateArticleById(this.state.articleId, formData).then(result => {
                const { data } = result;
                if (data) {
                    this.context.router.history.push(`/articles`);
                }
            });
        } else {
            // console.log('新建====: ', formData);
            createArticle(formData).then(result => {
                const { data } = result;
                if (data) {
                    this.context.router.history.push(`/articles`);
                }
            });
        }
    }

    onRef = (ref) => {
        this.child = ref;
    }

    render() {
        return (
            <div>
                <Header type={1} />
                <div className="container edit-container">
                    <EditForm
                        wrappedComponentRef={(form) => this.form = form}
                        article={this.props.curArticle}
                        allTags={this.props.tags}
                        onRef={this.onRef}
                        uploadCover={this.uploadCover}
                    />
                    <EditContent
                        onRef={this.onRef}
                        article={this.props.curArticle}
                    />
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
        initTags: () => {
            getTags().then(result => {
                const { data } = result;
                if (data) {
                    dispatch(initTags(data.tags));
                }
            });
        },
        articleDetail(id, typeNum = '') {
            return getArticleDetail(id, typeNum).then(result => {
                const { data } = result;
                if (data) {
                    let obj = Object.assign({ tags: data.tags }, data.article[0])
                    dispatch(setCurArticle(obj));
                }
            });
        },
        resetCurArticle() {
            dispatch(setCurArticle(null));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EditArticleContainer)