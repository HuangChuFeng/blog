import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import { Icon, } from 'antd';
import EditTag from '../../components/article/editTag'
import { createTag, removeTag, getTags } from '../../service/fetch'
import { addTag, deleteTag, initTags } from '../../reducers/articles'
import { changeCurNav } from '../../reducers/common'
import '../../css/article.less'

class Tags extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }
    
    componentDidMount() {
        this.props.initTags();      
        setTimeout(() => {
            this.props.changeCurNav('Tags')
        }, 0)  
    }

    clickTagHandler(tag) {
        this.context.router.history.push(`/articles/tags/${tag}`);
    }
    
    render() {
        
        return (
            <div>
                <Header type={1} formParentNav="Tags"/>
                <div className="container article-container">
                    <EditTag
                        isAdmin={this.props.isAdmin}
                        tags={this.props.tags}
                        initTags={this.props.initTags}
                        addTag={this.props.addTag}
                        deleteTag={this.props.deleteTag}
                        clickTagHandler={this.clickTagHandler.bind(this)}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tags: state.articlesReducer.tags,
        curNav: state.commonReducer.curNav,
        isAdmin: state.commonReducer.isAdmin
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
        deleteTag: (tagId, tagIndex) => {
            removeTag({tagId: tagId}).then(result => {
                const { data } = result;
                if (data) {
                    dispatch(deleteTag(tagIndex));
                } 
            });
        },
        addTag: (tag) => {
            createTag({name: tag}).then(result => {
                const { data } = result;
                if (data) {
                    dispatch(addTag(data.res));
                } 
            });
        },
        changeCurNav: (nav) => {
            dispatch(changeCurNav(nav));
        },
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tags)
