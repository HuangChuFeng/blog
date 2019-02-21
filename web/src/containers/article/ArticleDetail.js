import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Divider, Icon } from 'antd';
import Header from '../../components/Header'

export default class ArticleDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id
        }
    }
    static propTypes = {
        artilceId: PropTypes.number,
    }

    render() {
        return (
            <div>
                <Header type="1" />
                <div className="container article-detail-container">
                    <div className="left">
                        <a href="/articles"><Icon type="left"  className="back-btn"/></a>                    
                        <div className="top-info-box">
                            <h1>2019</h1>
                            <div className="top-bottom">
                                <span>01. 20 Beijing</span>
                                <span className="browse-num"><Icon type="fire" className="fire-icon" />{ 30 }</span>
                                <ul className="tag-list">
                                    <li>javascript</li>
                                    <li>webpack</li>
                                    <li>node</li>
                                </ul>
                            </div>
                        </div>
                        <div className="left-bottom-box">
                            <h3>title title title title</h3>
                            description  description  description  description  description  description  description  description  description  description  description  description  description 
                        </div>
                        <div className="control-box">
                            <span>上一篇</span>
                            <span>下一篇</span>
                        </div>
                    </div>
                    <div className="right">
                    <div>
                    detail=== {this.state.id}
                    脏检查大法 这三个字想必大家已经如雷贯耳，我2年多前出去面试的时候被问及最多的就是angular的脏检查，什么是脏检查？angular脏检查的时机是什么？
脏检查的原理就是，拷贝一份copy_viewModel在内存中，一旦有用户点击，输入操作，或ajax请求，setInterval，setTimeout等这些可能导致viewModel发生改变的行为，框架都会把copy_viewModel和最新的viewModel进行深度比较，一旦发现有属性（如vm.message）发生变化，则重新渲染与message绑定的DOM节点。
这也是为什么，一旦你没有使用ng自带的$http，$interval,$timeout,ng-click这些angular自己封装的API去操作viewModel，angular都不会自动去同步view，因为已经超出他的管辖范围了，你必须手动调用apply函数去强制执行一次脏检查，以同步view。
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

