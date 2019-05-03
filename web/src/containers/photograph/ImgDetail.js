import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, message } from 'antd';
import { getImgDetail, comment as commentImg, addImgPv, addImgFavor } from "../../service/fetch";
import MyComment from '../../components/Comment'

class ImgDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.match.params.id,
            imgEnlargeble: false,
            comments: [],
            img: {},
            curPage: 0,
            clickTypeNum: 0,             // 是否可翻页, 0表示可翻页, -1或1表示已经到最底部和最顶部了
        }
    }

    static propTypes = {
    }


    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.getImgDetail(this.state.id);
    }

    getImgDetail(id, typeNum) {
        getImgDetail(id, typeNum).then(result => {
            const { data } = result;
            if (data) {
                if (data.noMore) {
                    message.warning('已经是最后一篇了', 1);
                    this.setState({ clickTypeNum: typeNum })
                } else {
                    this.setState({
                        img: data.img[0],
                        id: data.img[0]._id,
                        clickTypeNum: 0,
                        comments: data.comment,
                    })
                    this.context.router.history.push(`/photograph/detail/${data.img[0]._id}`);
                    this.handleBrowser();
                }
            }
        });
    }

    // 放大/缩小图片
    resizeImgHandler = () => {
        this.setState({ 
            imgEnlargeble : !this.state.imgEnlargeble, 
        });
    }

    // 发表评论
    handleSubmit = (comment, cb) => {
        commentImg(this.state.id, comment).then(result => {
            if (result) {
                cb && cb(result);
            }
        });
    }

    handleBrowser() {
        setTimeout(() => {
            addImgPv(this.state.id).then(result => {
                const { data } = result;
                if (data) {
                    let img = Object.assign(this.state.img, { pv: (this.state.img.pv || 0)+ 1 })
                    this.setState({
                        img: img
                    });
                }
            });
        }, 2000);
    }
    
    // 上一张or上一张
    lastOrNextImg = (typeNum) => {
        this.getImgDetail(this.state.id, typeNum);
    }

    clickImgFavorHandler() {
        addImgFavor(this.state.id).then(result => {
            const { data } = result;
            if (data) {
                let img = Object.assign(this.state.img, { favor_count: (this.state.img.favor_count || 0) + 1 })
                this.setState({
                    img: img
                });
            }
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
                        <Icon type="left" className="icon left-icon" onClick={this.lastOrNextImg.bind(this, -1)}/>
                        { this.props.curImg && this.props.curImg.src ? 
                            <img src={require(`../../${this.props.curImg.src}`)} /> : <img src={require('../../static/img/img1.jpg')} />
                        }
                        <Icon type={ this.state.imgEnlargeble ? 'shrink' : 'arrows-alt'} className="icon size-icon" onClick={ this.resizeImgHandler.bind(this) } />
                        <Icon type="right" className="icon right-icon" onClick={this.lastOrNextImg.bind(this, 1)}/>
                    </div>
                </div>
                <div className="detail-box">
                    <div className="operate-box">
                        <div>
                            <Icon className="icon heart-icon" type="heart" onClick={this.clickImgFavorHandler.bind(this)}/> 
                            <span className="count-span">{this.state.img.favor_count || 0}</span>
                            <Icon className="icon" type="eye" />
                            <span className="count-span">{this.state.img.pv || 0}</span>
                            <Icon type="switcher" className="icon collection-icon" />
                        </div>
                    </div>
                    <div className="comment-wrap">
                        <MyComment 
                            receiver={this.state.img.author}
                            comments={this.state.comments} 
                            onSubmit={this.handleSubmit.bind(this)} 
                        />
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

            // dispatch(getImgById(id));
        },
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImgDetail)