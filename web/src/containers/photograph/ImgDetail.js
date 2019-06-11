import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, message, Spin } from 'antd';
import { getImgDetail, comment as commentImg, addImgPv, addImgFavor } from "../../service/fetch";
import MyComment from '../../components/Comment'

class ImgDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
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
        this.setState({ loading: true });
        getImgDetail(id, typeNum).then(result => {
            const { data } = result;
            if (data) {
                if (data.noMore) {
                    message.warning('已经是最后一张了', 1);
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
                this.setState({ loading: false });
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
                let count = data.type === 0 ? (this.state.img.likes || 0) - 1 : (this.state.img.likes || 0) + 1
                let img = Object.assign(this.state.img, { likes: count })
                this.setState({
                    img: img
                });
            }
        });
    }

    // 查看组图
    toGroupImg = (groupId) => {
        this.context.router.history.push(`/photograph/group/${groupId}`);
    }

    goBack() {
        this.context.router.history.push(`/photograph`);
    }

    render() {
        return (
            <div className="img-detail-page">
                {/* <Music/> */}
                <Spin spinning={this.state.loading}>
                    <div className={["img-switch-wraper", this.state.imgEnlargeble ? 'active' : ''].join(' ')}>
                        <div className="center-box">
                            { !this.state.imgEnlargeble &&
                                // <Link to="/photograph">
                                    <Icon type="close" className="icon close-icon" onClick={this.goBack.bind(this)}/>
                                // </Link>
                            }
                            <Icon type="left" className="icon left-icon" onClick={this.lastOrNextImg.bind(this, -1)}/>
                            <img src={this.state.img.src} alt="" />
                            <Icon type={ this.state.imgEnlargeble ? 'shrink' : 'arrows-alt'} className="icon size-icon" onClick={ this.resizeImgHandler.bind(this) } />
                            <Icon type="right" className="icon right-icon" onClick={this.lastOrNextImg.bind(this, 1)}/>
                        </div>
                    </div>
                    <div className="detail-box">
                        <div className="operate-box">
                            <div>
                                <Icon className="icon heart-icon" type="heart" onClick={this.clickImgFavorHandler.bind(this)}/> 
                                <span className="count-span">{this.state.img.likes || 0}</span>
                                <Icon className="icon" type="eye" />
                                <span className="count-span">{this.state.img.pv || 0}</span>
                                <Icon type="switcher" className="icon collection-icon" onClick={(e) => { this.toGroupImg(this.state.img.groupId) }}/>
                            </div>
                        </div>
                        <div className="comment-wrap">
                            <MyComment 
                                type={1}
                                receiver={this.state.img.author}
                                comments={this.state.comments} 
                                onSubmit={this.handleSubmit.bind(this)} 
                            />
                        </div>
                    </div>
                </Spin>
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    return {
        imgs: state.imgs,  // 告诉Connect组件我们需要什么数据
        curImg: state.curImg
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImgDetail)