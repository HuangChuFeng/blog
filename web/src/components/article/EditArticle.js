import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import WrappedArticleForm from './EditForm';

import E from 'wangeditor';
export default class EditArticle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent: this.props.article ? this.props.article.content : '',
        };
    }

    static propTypes = {
        article: PropTypes.object,
    }

    componentDidMount() {
        this.props.onRef(this);
        const elem = this.refs.editorElem;
        const editor = new E(elem);
        
        editor.customConfig.uploadImgShowBase64 = true
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
          this.setState({
            editorContent: html
          })
        }
        editor.create();
        editor.txt.html(this.state.editorContent);
    }

    onRef = (ref) => {
        this.child = ref;
    }
    
    getFormData() {
        let formData = Object.assign({
            content: this.state.editorContent
        }, this.child.getFormData());
        return formData;
    }
    
    render() {
        return (
            <div>
                <WrappedArticleForm onRef={this.onRef} article={this.props.article} />
                <div ref="editorElem" className="edit-wrapper">
                </div>
            </div>
        )
    }
}