import React, { Component } from 'react'
import { Link } from 'react-router-dom';

import PropTypes from 'prop-types'
import { Menu, Dropdown, Icon } from 'antd';
import { toast } from "react-toastify";
import LoginForm from '../containers/loginToast';
import { connect } from 'react-redux'
import { changeCurNav, changeLoginStatus, changeUserType, changeShowMusic } from '../reducers/common'
import { quit } from "../service/fetch";


const articleNavArr = [
    { text: '所有文章' },
    {
        text: '笔记',
        type: 0
        // child: ['原创', '分享']
    },
    { text: '生活', type: 1 },
    // { text: '项目', url: '/articles' },
    { text: 'Tags', url: '/articles/tags' },
    { text: '摄影', url: '/photograph'},
]

const imgNavArr = [
    {
        text: '所有照片',
        // child: ['所有排序', '时间排序']
    },
    { text: '建筑' },
    { text: '人像' },
    { text: '街拍' },
    { text: '风景' },
    { text: '其他' },
    { text: '博客', url: '/articles'},
]

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
            navArr: this.props.type === 0 ? imgNavArr : articleNavArr,
            showMenu: false,
            isLargeScreen: true,        // 大屏
            loginText: '退出',
        }
    }

    static propTypes = {
        type: PropTypes.number,
        formParentNav: PropTypes.string,
        handleNavChange: PropTypes.func
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    componentDidMount() {
        // window.location.pathname !== '/about' && this.props.changeShowMusic(false)
        if(document.documentElement.clientWidth <= 960) {
            this.setState({ isLargeScreen: false })
        }
        if(this.context.router.route.location.pathname === '/about') {
            this.setState({
                activeIndex: this.state.navArr.length
            })
        } else {
            this.state.navArr.forEach((item, index) => {
                if (item.text === this.props.formParentNav || item.text === this.props.curNav) {
                    this.setState({
                        activeIndex: index
                    })
                }
            })
        }
    }
    
    navClickHandler = (item, index) => {
        if(!item.child && !item.url) {
            let url = '';
            this.setState({
                activeIndex: index,
                showMenu: false,
            });
            if(this.props.type !== 0) {
                url = '/articles';
                if(item.type !== undefined) {
                    url += `?type=${item.type}`
                }
                this.props.handleNavChange && this.props.handleNavChange(item.type);
            } else {
                url = '/photograph';
                url += `?type=${item.text}`
                this.props.handleNavChange && this.props.handleNavChange(item.text);
            }
            this.context.router.history.push(url);
            this.props.changeCurNav && this.props.changeCurNav(this.state.navArr[index].text)
        } else {
            this.props.changeCurNav('')
        }
    }

    clickAbout() {
        // this.props.changeShowMusic(true)
        this.setState({
            activeIndex: this.state.navArr.length,
            showMenu: false,
        });
        this.context.router.history.push('/about');
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
                window.sessionStorage.removeItem('user');
                window.sessionStorage.removeItem('type');
                this.props.changeLoginStatus(false);
                this.props.changeUserType(false);
                this.context.router.history.push(`/`);     
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
                        <li><Link to='/'><Icon type="home" className="index-btn" /></Link></li>
                        { this.state.navArr.map((item, i) => {
                                let content = '';
                                if(item.child) {
                                    let menu = (
                                        <Menu>
                                            {item.child.map((item1, i) => 
                                                <Menu.Item key={i}>
                                                    <span>{ item1 }</span>
                                                </Menu.Item>
                                                )
                                            }
                                        </Menu>
                                    );
                                    content = <Dropdown overlay={menu} trigger={['click']}>
                                                <span onClick={this.navClickHandler.bind(this, item.child, i)}>{ item.text }<Icon type="down" /></span>
                                            </Dropdown>;
                                } else if(item.url) {
                                    content = <Link to={ item.url }>{ item.text }</Link>;
                                } else {
                                    content = <span>{ item.text }</span>
                                }
                                return <li key={i} onClick={this.navClickHandler.bind(this, item, i)} className={ i === this.state.activeIndex ? 'active' : '' }>{ content }</li>
                            }
                        )}
                        <li onClick={this.clickAbout.bind(this)} className={ this.state.navArr.length === this.state.activeIndex ? 'active' : '' }>关于</li>
                        <li className="to-index-link">
                            { this.props.isLogined &&
                                <span className="op-btn" onClick={this.quitHandle.bind(this)}>退出</span>
                            }
                            { !this.props.isLogined && 
                                <span>
                                    <span className="op-btn" onClick={this.loginHandle.bind(this, 1)}>登录 </span>
                                    <span className="op-btn" onClick={this.loginHandle.bind(this, 0)}>注册</span>
                                </span>
                            }
                        </li>
                    </ul>
                    }
                    { !this.state.showMenu && 
                    <div>
                        <Link to='/'><Icon type="home" className="index-btn-1" /></Link>
                        <span className="current-nav">{ this.props.curNav }</span>
                    </div>
                    }
                    <div className="menu-icon" onClick={this.toggleMenu.bind(this)}>
                        { !this.state.showMenu && 
                            <span>
                                <Icon type="bars"/>
                            </span>
                            
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
        isLogined: state.commonReducer.isLogined,
        isAdmin: state.commonReducer.isAdmin
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
        changeUserType: (isAdmin) => {
            dispatch(changeUserType(isAdmin));
        },
        changeShowMusic: (show) => {
            dispatch(changeShowMusic(show));
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header)

