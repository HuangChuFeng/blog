import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initImgs, getImgById } from '../../reducers/imgs'
import { fetchImgs } from "../../service/fetch";
import { Icon } from 'antd';

class ImgDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            imgEnlargeble: false,
        }
    }

    static propTypes = {
        imgs: PropTypes.array,
        curImg: PropTypes.object,
        getImgs: PropTypes.func,
        getImgById: PropTypes.func,
    }

    componentWillMount() {
        // this.props.initImgs(this.props.imgs);
        this.props.getImgById(this.state.id);
    }

    // 放大/缩小图片
    resizeImgHandler = () => {
        this.setState({ 
            imgEnlargeble : !this.state.imgEnlargeble, 
        });
    }
    render() {
        return (
            <div className="img-detail-page">
                <div className={["img-switch-wraper", this.state.imgEnlargeble ? 'active' : ''].join(' ')}>
                    <div className="center-box">
                        { !this.state.imgEnlargeble &&
                            <Link to="/photograph">
                                <Icon type="close" className="icon close-icon" />
                            </Link>
                        }
                        <Icon type="left" className="icon left-icon" />
                        { this.props.curImg && this.props.curImg.src ? 
                            <img src={require(`../../${this.props.curImg.src}`)} /> : <img src={require('../../static/img/img1.jpg')} />
                        }
                        <Icon type={ this.state.imgEnlargeble ? 'shrink' : 'arrows-alt'} className="icon size-icon" onClick={ this.resizeImgHandler.bind(this) } />
                        <Icon type="right" className="icon right-icon"  />
                    </div>
                </div>
                <div className="detail-box">
                    <div className="operate-box">
                        <div>
                            <Icon className="icon heart-icon" type="heart" /> 
                            <span className="count-span">50</span>
                            <Icon type="switcher" className="icon collection-icon" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    // console.log('=======', state)
    return {
        imgs: state.imgs,  // 告诉Connect组件我们需要什么数据
        curImg: state.curImg
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // 告诉Connect组件我们要执行什么操作
        getImgById: (id) => {
            dispatch(getImgById(id));
        },
        initImgs: (imgs) => {
            if(imgs.length === 0) {
                return fetchImgs(imgs).then(result => {
                    const {data} = result;
                    if (data) {
                        dispatch(initImgs(data.imgs));
                    } 
                });
            } else {
                dispatch(initImgs([]));
            }
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImgDetail)