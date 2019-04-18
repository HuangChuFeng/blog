import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Header from '../../components/Header'
import { Icon, } from 'antd';
import EditTag from '../../components/article/editTag'
import { createTag, removeTag, getTags } from '../../service/fetch'
import { addTag, deleteTag, initTags } from '../../reducers/articles'

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
    }
    
    render() {
        
        return (
            <div>
                <Header type="1" />
                <div className="container article-container">
                    <EditTag
                        tags={this.props.tags}
                        initTags={this.props.initTags}
                        addTag={this.props.addTag}
                        deleteTag={this.props.deleteTag}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        tags: state.articlesReducer.tags
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
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Tags)
