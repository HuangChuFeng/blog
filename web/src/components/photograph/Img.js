import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Icon } from 'antd';


const bgColors = ['rgba(106,10,171,.3)', 'rgba(199,0,125,.3)', 'rgba(52,21,176,.3)', 'rgba(68,3,111,.3)', 'rgba(64,19,175,.3)', 'rgba(166,0,166,.3)', 'rgba(108,0,108,.3)'];

export default class Img extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgBoxStyle: {
                background: bgColors[Math.floor(Math.random()*bgColors.length)],
                height: ''
            }
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    static propTypes = {
        img: PropTypes.object,
        index: PropTypes.number,
        onDeleteImg: PropTypes.func
    }

    componentDidMount() {
        // 这里页面加载完成之后resizeThrottle函数立即执行了, 所以函数内的start直接打印了
        // 以后每次发生resize事件时只会触发resizeThrottle函数的返回函数
        this.onResizeHandler();
        window.onresize = this.resizeThrottle(this.onResizeHandler.bind(this), 500, true);
    }

    onResizeHandler() {
        // resize节流 500ms内只能触发一次
        let width = this.refs.imgBox.clientWidth; // 宽固定
        let scale = this.props.img.h / this.props.img.w;
        let height = width * scale;
        this.refs.imgBox.style.height = height + 'px';
    }

    resizeThrottle(fn, wait, immediate) {
        let timer = null;
        return function() {
            let args = arguments;
            if (immediate) {
                fn.apply(this, args);
                immediate = false;
            }
            if (!timer) {
                timer = setTimeout(() => {
                    console.log('timer is null') // 每隔500ms清空一次timer;
                    fn.apply(this, args);
                    timer = null;
                }, wait);
            }
        }
    }

    imgOnLoad = () => {
        console.log('img onload');
        
    }

    // 查看图片详情
    toImgDetailPage = id =>  {
        this.context.router.history.push(`/photograph/detail/${id}`);       
    }

    render() {
        return (
            <div className="img-wraper" onClick={this.toImgDetailPage.bind(this, this.props.img._id)}>
                <div className="img-box" ref="imgBox" style={this.state.imgBoxStyle}>   
                    <img src={this.props.img.src} alt="" onLoad={this.imgOnLoad.bind(this)} />
                </div>

                <div className="img-cover">
                    <div className="operate-box">
                       <div>
                            <Icon className="heart-icon" type="heart" /> 
                            <span className="count-span">{this.props.img.favor_count}</span>
                            <Icon type="switcher" className="collection-icon" />
                            <Icon type="delete" className="collection-icon" onClick={this.props.onDeleteImg.bind(this, this.props.img._id, this.props.index)}/>
                       </div>
                    </div>
                    <div className="info-box">
                        名称
                    </div>
                </div>
            </div>
        )
    }
}

