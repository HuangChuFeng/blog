import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Input, Button, Icon } from 'antd';

import E from 'wangeditor'

export default class EditArticle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorContent: ''
        }
    }
    componentDidMount() {
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
    }
    clickHandle() {
        console.log(this.state.editorContent);
    }
    render () {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form>
                <Form.Item
                    label="Note"
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 12 }}
                    >
                    {getFieldDecorator('note', {
                        rules: [{ required: true, message: 'Please input your note!' }],
                    })(
                        <Input />
                    )}
                    </Form.Item>
                </Form>
                <div ref="editorElem" className="edit-wrapper">
                </div>
            </div>
        )
    }
}