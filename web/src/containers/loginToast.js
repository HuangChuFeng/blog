import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Form, Icon, Input, Button } from 'antd';
import { toast } from "react-toastify";
import { login, register } from "../service/fetch";

class LoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                register(values).then(result => {
                    const { data } = result;
                    if (data) {
                        toast.dismiss();
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item label="一个来自">
                    {getFieldDecorator('source', {
                        rules: [{ required: true, message: '我要知道你从哪里来啊朋友' }],
                    })(
                        <Input placeholder="社交平台" />
                    )}
                </Form.Item>
                <Form.Item label="的">
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '我要知道你的名字啊朋友' }],
                    })(
                        <Input placeholder="小可爱" />
                    )}
                </Form.Item>
                <Form.Item label="邮箱">
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: '我要知道你的名字啊朋友' }],
                    })(
                        <Input placeholder="邮箱" />
                    )}
                </Form.Item>
                <Form.Item label="密码">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '我要知道你的名字啊朋友' }],
                    })(
                        <Input type="password" placeholder="密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">占 坑</Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create({ name: 'normal_login' })(LoginForm);

// const mapStateToProps = (state) => {
//     return {
//     }
// }

// const mapDispatchToProps = (dispatch) => {
//     return {
//     }
// }

// export default connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(loginToast)
