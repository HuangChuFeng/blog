import React, { Component } from 'react';
import PropTypes from 'prop-types';
import E from 'wangeditor';
// import ReactMarkdown from 'react-markdown'
// import Divider from 'antd';

export default class EditContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent: '',
            // editorContent: `
            // This block of Markdown contains <a href="https://en.wikipedia.org/wiki/HTML">HTML</a>, and will require the <code>html-parser</code> AST plugin to be loaded, in addition to setting the <code class="prop">escapeHtml</code> property to false.
            // `
        };
    }

    static propTypes = {
        article: PropTypes.object,
        onRef: PropTypes.func
    }

    componentDidMount() {
        this.props.onRef(this)
        const elem = this.refs.editorElem;
        this.editor = new E(elem);
        this.editor.customConfig.uploadImgShowBase64 = true
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {
            this.setState({
                editorContent: html
            })
        }
        this.editor.create();
    }
    
    componentWillReceiveProps(nextProps) {
        if(nextProps.article && !this.props.article) {
            this.setState({
                editorContent: nextProps.article.content
            })
            this.editor.txt.html(nextProps.article.content);
        }
    }

    getContent() {
        return { content: this.state.editorContent };
    }
    
    render() {
        return (
            // <ReactMarkdown className="edit-wrapper" source={this.state.editorContent} />
            <div ref="editorElem" className="edit-wrapper">
            </div>
        )
    }
}