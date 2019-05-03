import React, { Component } from 'react'
import Img from './Img'
import Masonry from 'react-masonry-component';
import PropTypes from 'prop-types'

export default class ImgList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    // 对父组件传入的props数据进行类型检测
    static propTypes = {
        imgs: PropTypes.array,
        onDeleteImg: PropTypes.func
    }

    // 声明变量, 初始化默认值
    static defaultProps = {
        imgs: [],
    }

    render() {
        return (
            <div>
                <Masonry
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                options={{transitionDuration: 0}} >
                    {this.props.imgs.map((img, i) =>
                    <Img
                        img={img}
                        key={i}
                        index={i}
                        onDeleteImg={this.props.onDeleteImg.bind(this)} />
                    )}
                </Masonry>
            </div>
        )
    }
}

