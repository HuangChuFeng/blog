import React, { Component } from 'react'
import Img from './Img'
// import ImageLayout from 'react-image-layout';
import Masonry from 'react-masonry-component';
import PropTypes from 'prop-types'
import { Affix } from 'antd';

export default class ImgList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    // 对父组件传入的props数据进行类型检测
    static propTypes = {
        imgs: PropTypes.array,
    }

    // 声明变量, 初始化默认值
    static defaultProps = {
        imgs: [],
    }

    handleDeleteComment(index) {
        if(this.props.onDeleteComment) {
            this.props.onDeleteComment(index)
        }
    }

    render() {
        return (
            <div className="img-container">
                <div>
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
            </div>
        )
    }
}

