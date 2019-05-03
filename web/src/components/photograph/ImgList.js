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
        onDeleteImg: PropTypes.func,
        addImgFavor: PropTypes.func,
        isAdmin: PropTypes.bool
    }

    // 声明变量, 初始化默认值
    static defaultProps = {
        imgs: [],
    }

    render() {
        return (
            <div>
            { this.props.imgs.length > 0 &&
                <Masonry
                disableImagesLoaded={false}
                updateOnEachImageLoad={false}
                options={{transitionDuration: 0}} >
                    {this.props.imgs.map((img, i) =>
                    <Img
                        img={img}
                        key={i}
                        index={i}
                        addImgFavor={this.props.addImgFavor.bind(this)}
                        onDeleteImg={this.props.onDeleteImg.bind(this)} 
                        isAdmin={this.props.isAdmin}/>
                    )}
                </Masonry>
            }
            { this.props.imgs.length === 0 &&
                <div style={{textAlign: 'center'}}>暂无数据</div>
            }
            </div>
        )
    }
}

