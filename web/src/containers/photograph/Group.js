import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initImgs, deleteImg, addImg, addImgFavorCount } from '../../reducers/imgs'
import PropTypes from 'prop-types'
import { changeCurNav } from '../../reducers/common'
import ImgList from '../../components/photograph/ImgList'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Music from '../../components/Music'
import { Button, Spin } from 'antd';
import '../../css/img.less'

import { fetchGroupImgs, deleteImgById, addImgFavor } from "../../service/fetch";

class ImgListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            groupId: this.props.match.params.id,
            groupInfo: {}
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    componentWillMount() {
        this.loadImgs();
        if(!this.props.curNav) {
            this.props.changeCurNav('所有照片')
        }
    }

    loadImgs() {
        this.setState({ loading: true })
        this.props.initImgs([], 1);
        return fetchGroupImgs(this.state.groupId).then(result => {
            const {data} = result;
            if (data) {
                this.setState({
                    groupInfo: data.group.info
                })
                this.props.initImgs(data.group.imgs, 1);
            }
            this.setState({ loading: false })
        })
    }

    handleDeleteImg(e, img, index) {
        let { src, _id, group_id } = img;
        src = src.split('/');
        let imgName = src[src.length - 1];
        e.stopPropagation();
        deleteImgById({_id, imgName, group_id}).then(result => {
            const { data } = result;
            if (data) {
                this.props.deleteImg(index);
            } 
        })
    }

    handleAddImgFavor(e, imgId, index) {
        e.stopPropagation();
        addImgFavor(imgId).then(result => {
            const { data } = result;
            if (data) {
                this.props.addImgFavorCount(index);
            }
        });
    }

    handleNavChange(category) {
        this.setState({ pageNum: 1 })
        category = (category === '所有照片' ? '' : category);
        this.loadImgs(category);
    }
    goBack() {
        this.context.router.history.push(`/photograph`);
    }

    render () {
        return (
            <div>
                <Header 
                    type={0} 
                    handleNavChange={this.handleNavChange.bind(this)}
                />
                <Music/>
                <div className="container img-container">
                    <Spin spinning={this.state.loading}>
                        <div className="group-info">
                            <p className="title">{ this.state.groupInfo.title }</p>
                            <ul className="tag-list">
                                <li>{ this.state.groupInfo.category }</li>
                            </ul>
                            <p className="date">{ this.state.groupInfo.created_at }</p>
                        </div>
                        <ImgList
                            imgs= {this.props.imgs}
                            addImgFavor={this.handleAddImgFavor.bind(this)}
                            onDeleteImg= {this.handleDeleteImg.bind(this)}
                            isAdmin={this.props.isAdmin}
                        />
                        <div className="group-info">
                            <Button onClick={this.goBack.bind(this)}>返 回</Button>
                        </div>
                    </Spin>
                    <Footer/>
                </div>
            </div>
        )
    }
}

// 当前组件需要的state数据
const mapStateToProps = (state) => {
    return {
        imgs: state.imgsReducer.imgs,
        curNav: state.commonReducer.curNav,
        isAdmin: state.commonReducer.isAdmin
    }
}
  
// 当前组件需要发起的事件
const mapDispatchToProps = (dispatch) => {
    return {
        initImgs: (imgs, pageNum) => {
            dispatch(initImgs(imgs, pageNum));
        },
        deleteImg: (imgIndex) => {
            dispatch(deleteImg(imgIndex))
        },
        addImg: (img) => {
            dispatch(addImg(img))
        },
        changeCurNav: (nav) => {
            dispatch(changeCurNav(nav));
        },
        addImgFavorCount: (index) => {
            dispatch(addImgFavorCount(index));
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImgListContainer)