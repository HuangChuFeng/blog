import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initImgs, deleteImg, addImg, addImgFavorCount } from '../../reducers/imgs'
import { changeCurNav } from '../../reducers/common'
import { Affix, Icon, Button } from 'antd';
import ImgList from '../../components/photograph/ImgList'
import UploadImg from '../../components/photograph/UploadImg'
import Header from '../../components/Header'
import '../../css/img.less'

import { fetchImgs, deleteImgById, addImgFavor } from "../../service/fetch";

class ImgListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
        }
    }
    componentDidMount() {
        this._loadimgs();
        if(!this.props.curNav) {
            this.props.changeCurNav('所有照片')
        }
    }

    _loadimgs() {
        this.props.initImgs();
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
        category = (category === '所有照片' ? '' : category);
        this.props.initImgs(category);
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
        initImgs: (category) => {
            return fetchImgs(category).then(result => {
                const {data} = result;
                if (data) {
                    dispatch(initImgs(data.imgs));
                } 
            });
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