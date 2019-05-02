import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types'
import { Menu, Dropdown, Icon } from 'antd';
import { toast } from "react-toastify";
import LoginForm from '../containers/loginToast';
import { connect } from 'react-redux'
import { changeCurNav, changeLoginStatus } from '../reducers/common'
import { quit } from "../service/fetch";


const articleNavArr = [
    { text: '所有文章', url: '/articles' },
    {
        text: '前端笔记',
        child: ['原创', '分享']
    },
    { text: '生活', url: '/articles' },
    { text: '项目', url: '/articles' },
    { text: 'Tags', url: '/articles/tags' },
]

const imgNavArr = [
    {
        text: '所有照片',
        child: ['所有排序', '时间排序']
    },
    { text: '建筑', url: '/photograph' },
    { text: '人像', url: '/photograph' },
    { text: '街拍', url: '/photograph' },
    { text: '风景', url: '/photograph' },
    { text: '其他', url: '/photograph' },
]

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            navArr: this.props.type == 0 ? imgNavArr : articleNavArr,
            showMenu: false,
            isLargeScreen: true,        // 大屏
            loginText: '退出',
        }
    }

    static propTypes = {
        type: PropTypes.number,
        formParentNav: PropTypes.string,
    }

    componentDidMount() {
        if(document.documentElement.clientWidth <= 960) {
            this.setState({ isLargeScreen: false })
        }
        this.state.navArr.forEach((item, index) => {
            if (item.text === this.props.formParentNav || item.text === this.props.curNav) {
                this.setState({
                    activeIndex: index
                })
            }
        })
    }
    
    navClickHandler = (index) => {
        this.setState({
             activeIndex: index,
             showMenu: false,
        });
        this.props.changeCurNav(this.state.navArr[index].text)
    }

    toggleMenu() {
        this.setState({
            showMenu: !this.state.showMenu,
        })
    }
    
    quitHandle() {
        quit().then(result => {
            if (result) {
                this.setState({ isLogined: false })
                window.localStorage.removeItem('user');
                this.props.changeLoginStatus(false);
            }
        });
    }

    loginHandle(type) {
        toast(<LoginForm type={type}/>,{
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });
        this.setState({
            showMenu: false,
        })
    }

    render() {
        return (
            <div>
                <div className="page-header">
                    { (this.state.isLargeScreen || this.state.showMenu) && 
                    <ul className="img-nav-ul">
                        { this.state.navArr.map((item, i) => {
                                let content = '';
                                if(item.child) {
                                    let menu = (
                                        <Menu>
                                            {item.child.map((item1, i) => 
                                                <Menu.Item key={i}>
                                                    <a href="#">{ item1 }</a>
                                                </Menu.Item>
                                                )
                                            }
                                        </Menu>
                                    );
                                    content = <Dropdown overlay={menu} trigger={['click']}>
                                                <span>{ item.text }<Icon type="down" /></span>
                                            </Dropdown>;
                                } else {
                                    content = <Link to={ item.url }>{ item.text }</Link>;
                                }
                                return <li key={i} onClick={this.navClickHandler.bind(this, i)} className={ i == this.state.activeIndex ? 'active' : '' }>{ content }</li>
                            }
                        )}
                        <li className="to-index-link">
                            <Link to='/'> <Icon type="home" /> 主页</Link>
                            { this.props.isLogined &&
                                <span className="op-btn" onClick={this.quitHandle.bind(this)}>退出</span>
                            }
                            { !this.props.isLogined && 
                                <span>
                                    <span className="op-btn" onClick={this.loginHandle.bind(this, 1)}>登录</span>
                                    <span className="op-btn" onClick={this.loginHandle.bind(this, 0)}>注册</span>
                                </span>
                            }
                        </li>
                    </ul>
                    }
                    { this.state.showMenu && 
                        <span className="current-nav">{ this.props.curNav }</span>
                    }
                    <div className="menu-icon" onClick={this.toggleMenu.bind(this)}>
                        { !this.state.showMenu && 
                            <Icon type="bars"/>
                        }
                        { this.state.showMenu && 
                            <Icon type="close"/>
                        }
                    </div>
                </div>
                { this.state.showMenu && 
                    <div className="nav-mask"></div>
                }
            </div>
        )
    }
}

// 当前组件需要的state数据
const mapStateToProps = (state) => {
    return {
        curNav: state.commonReducer.curNav,
        isLogined: state.commonReducer.isLogined
    }
}
  
// 当前组件需要发起的事件
const mapDispatchToProps = (dispatch) => {
    return {
        changeCurNav: (nav) => {
            dispatch(changeCurNav(nav));
        },
        changeLoginStatus: (isLogin) => {
            dispatch(changeLoginStatus(isLogin));
        },
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)

