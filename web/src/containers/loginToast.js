import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd';
import { toast } from "react-toastify";
import { login, register } from "../service/fetch";
import { connect } from 'react-redux'
import { changeLoginStatus, changeUserType, setLikes } from '../reducers/common'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnText: '注册',
        }
    }
    static propTypes = {
        type: PropTypes.number, // 0 注册, 1 登录
    }
    componentDidMount() {
        this.setState({
            btnText: this.props.type === 0 ? '注 册' : '登 录'
        })
    }

    handleResult(result) {
        const { data } = result;
        if (data) {
            window.sessionStorage.setItem('type', data.res.type);
            window.sessionStorage.setItem('user', `来自${data.res.source}的${data.res.name}`);
            toast.dismiss();
            this.props.changeLoginStatus(true); 
            this.props.changeUserType(data.res.type === 1);
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if(this.props.type === 0) {
                    register(values).then(result => {
                        this.handleResult(result);
                    });
                } else {
                    login(values).then(result => {
                        this.handleResult(result);
                    });
                }
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                { this.props.type === 0 && 
                    <div>
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
                    </div>
                }
                <Form.Item label="邮箱">
                    {getFieldDecorator('email', {
                        rules: [{ required: true, message: '输入邮箱' }],
                    })(
                        <Input placeholder="邮箱" />
                    )}
                </Form.Item>
                <Form.Item label="密码">
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '输入密码' }],
                    })(
                        <Input type="password" placeholder="密码" />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className="login-form-button">{ this.state.btnText }</Button>
                </Form.Item>
            </Form>
        );
    }
}

const loginToast = Form.create({ name: 'normal_login' })(LoginForm);

const mapStateToProps = (state) => {
    return {
        isLogined: state.commonReducer.isLogined,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeLoginStatus: (isLogin) => {
            dispatch(changeLoginStatus(isLogin));
        },
        changeUserType: (isAdmin) => {
            dispatch(changeUserType(isAdmin));
        },
        setLikes: (likes) => {
            dispatch(setLikes(likes));
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(loginToast)
