import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Affix, Menu, Dropdown, Icon } from 'antd';


const articleNavArr = [
    { text: '所有文章' },
    {
        text: '前端笔记',
        child: ['原创', '分享']
    },
    { text: '生活' },
    { text: '作品' },
    { text: 'Tag' },
]

const imgNavArr = [
    {
        text: '所有照片',
        child: ['所有排序', '时间排序']
    },
    { text: '建筑' },
    { text: '人像' },
    { text: '街拍' },
    { text: '风景' },
    { text: '其他' },
]

export default class Img extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeIndex: 0,
        }
    }

    static propTypes = {
        type: PropTypes.string
    }
    
    navClickHandler = (index) => {
        this.setState({ activeIndex: index });
    } 

    render() {
        let navArr = this.props.type == 0 ? imgNavArr : articleNavArr;
        return (
            <div className="page-header">
                <ul className="img-nav-ul">
                    { navArr.map((item, i) => {
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
                                content = item.text;
                            }
                            return <li key={i} onClick={this.navClickHandler.bind(this, i)} className={ i == this.state.activeIndex ? 'active' : '' }>{ content }</li>
                        }
                    )}
                </ul>
                <a href="/" className="to-index-link">主页 <Icon type="home" /></a>
            </div>
        )
    }
}

