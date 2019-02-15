import React, { Component } from 'react'
import Img from './Img'
// import ImageLayout from 'react-image-layout';
import Masonry from 'react-masonry-component';
import PropTypes from 'prop-types'
import { Affix } from 'antd';

export default class ImgList extends Component {
    // 类型检测
    static propTypes = {
        imgs: PropTypes.array
    }

    // 声明变量, 初始化默认值
    static defaultProps = {
        imgs: []
    }

    handleDeleteComment(index) {
        if(this.props.onDeleteComment) {
            this.props.onDeleteComment(index)
        }
    }

    render() {
        // for(var i = 0; i < this.props.imgs.length; i++) {
        //     this.props.imgs[i].src = require(`"${this.props.imgs[i].src}"`)
        // }
        return (
            <div className="img-container">
            <Masonry
                disableImagesLoaded={false}
                updateOnEachImageLoad={false} >
                {this.props.imgs.map((img, i) =>
                <Img
                    img={img}
                    key={i}
                    index={i}
                    onDeleteComment={this.handleDeleteComment.bind(this)} />
                )}
                </Masonry>
            </div>
        )
    }
}

