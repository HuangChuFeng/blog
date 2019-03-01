import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Icon } from 'antd';


const bgColors = ['#6A0AAB', '#C7007D', '#3415B0', '#44036F', '#4013AF', '#A600A6', '#6C006C'];

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
        img: PropTypes.shape({
            src: PropTypes.string,
        }),
    }

    static defaultProps = {
        img: null
    }

    componentDidMount() {
        window.onresize = this.resizeThrottle(this.onResizeHandler, 500, true);
    }

    onResizeHandler() {
        // resize节流 500ms内只能触发一次
        console.log('resize');
        // let vm = this;
        // let width = vm.refs.imgBox.clientWidth;
    }

    resizeThrottle(fn, wait, immediate) {
        let timer = null, callNow = immediate;
        console.log('start'); // 此处只执行一次
        return function() {
            console.log('1111')
            let context = this,
                args = arguments;
            if (callNow) {
                console.log('调用时最开始执行, 只执行一次')
                fn.apply(context, args);
                callNow = false;
            }
            if (!timer) {
                timer = setTimeout(() => {
                    console.log('timer is null')
                    fn.apply(context, args);
                    timer = null;
                }, wait);
            }
        }
    }

    handleDeleteComment(index) {
        if(this.props.onDeleteComment) {
            this.props.onDeleteComment(index)
        }
    }

    imgOnLoad = () => {
        console.log('img onload');
        
    }

    // 查看图片详情
    toImgDetailPage = id =>  {
        this.context.router.history.push(`/photograph/${id}`);       
    }

    render() {
        return (
            <div className="img-wraper" onClick={this.toImgDetailPage.bind(this, this.props.img.id)}>
                <div className="img-box" ref="imgBox" style={this.state.imgBoxStyle}>   
                    {/* <img src={this.props.img.src} alt="" onLoad={this.imgOnLoad.bind(this)} /> */}
                </div>  

                <div className="img-cover">
                    <div className="operate-box">
                       <div>
                            <Icon className="heart-icon" type="heart" /> 
                            <span className="count-span">50</span>
                            <Icon type="switcher" className="collection-icon" />
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

