import React, { Component } from 'react'
import { connect } from 'react-redux'
import { initImgs, deleteImg, addImg, addImgFavorCount } from '../../reducers/imgs'
import { changeCurNav } from '../../reducers/common'
import { Button, BackTop  } from 'antd';
import ImgList from '../../components/photograph/ImgList'
import UploadImg from '../../components/photograph/UploadImg'
import Header from '../../components/Header'
import Loading from '../../components/Loading'
import '../../css/img.less'

import { fetchImgs, deleteImgById, addImgFavor } from "../../service/fetch";

class ImgListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
            showLoading: false,
            pageNum: 1,
            noMore: false,  // 是否没有更多了
        }
    }
    componentDidMount() {
        this.loadImgs();
        if(!this.props.curNav) {
            this.props.changeCurNav('所有照片')
        }
    }

    loadImgs(category = '') {
        let params = {
            pageNum: this.state.pageNum,
            category
        }
        this.setState({ showLoading: true });
        return fetchImgs(params).then(result => {
            const {data} = result;
            if (data) {
                this.props.initImgs(data.imgs, this.state.pageNum);
                this.setState({ noMore: data.noMore })
                this.setState({ showLoading: false });
            } else {
                this.setState({ showLoading: false });
                this.setState({ noMore: true })
            }
        })
    }

    loadMore() {
        this.setState({ pageNum: this.state.pageNum + 1 }, function () {
            this.loadImgs();
        })
    }

    visibleHandler = (flag) => {
        this.setState({ dialogVisible: flag });
    }

    handleDeleteImg(e, imgId, index) {
        e.stopPropagation();
        deleteImgById({imgId: imgId}).then(result => {
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
        this.initImgs(category);
    }

    render () {
        return (
            <div>
                <Header 
                    type={0} 
                    handleNavChange={this.handleNavChange.bind(this)}
                />
                <div className="container img-container">
                    { this.props.isAdmin && 
                    <Button type="primary" className="common-btn" onClick={this.visibleHandler.bind(this, true)}>
                        上传照片
                    </Button>
                    }
                    <UploadImg 
                        visible={this.state.dialogVisible} 
                        visibleHandler={this.visibleHandler}
                        onAddImg={this.props.addImg}
                    />
                    <ImgList
                        imgs= {this.props.imgs}
                        addImgFavor={this.handleAddImgFavor.bind(this)}
                        onDeleteImg= {this.handleDeleteImg.bind(this)}
                        isAdmin={this.props.isAdmin} 
                    />
                    { !this.state.noMore && 
                    <Loading 
                        show={this.state.showLoading}
                        loadMore={this.loadMore.bind(this)}
                    />
                    }
                </div>
                <BackTop target={() => document.getElementsByClassName('container')[0]}/>
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