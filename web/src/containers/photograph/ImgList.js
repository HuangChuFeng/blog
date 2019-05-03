import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initImgs, deleteImg, addImg } from '../../reducers/imgs'
import { changeCurNav } from '../../reducers/common'
import { Affix, Icon, Button } from 'antd';
import ImgList from '../../components/photograph/ImgList'
import UploadImg from '../../components/photograph/UploadImg'
import Header from '../../components/Header'
import '../../css/img.less'

import { fetchImgs, deleteImgById } from "../../service/fetch";

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

    handleDeleteImg(imgId, index) {
        deleteImgById({imgId: imgId}).then(result => {
            const { data } = result;
            if (data) {
                this.props.deleteImg(index);
            } 
        })
    }

    render () {
        return (
            <div>
                <Header type={0} />
                <div className="container img-container">
                    <Button type="primary" className="common-btn" onClick={this.visibleHandler.bind(this, true)}>
                        上传照片
                    </Button>
                    <UploadImg 
                        visible={this.state.dialogVisible} 
                        visibleHandler={this.visibleHandler}
                        onAddImg={this.props.addImg}
                    />
                    <ImgList
                        imgs= {this.props.imgs}
                        onDeleteImg= {this.handleDeleteImg.bind(this)} />
                </div>
            </div>
        )
    }
}

// 当前组件需要的state数据
const mapStateToProps = (state) => {
    return {
        imgs: state.imgsReducer.imgs,
        curNav: state.commonReducer.curNav
    }
}
  
// 当前组件需要发起的事件
const mapDispatchToProps = (dispatch) => {
    return {
        initImgs: () => {
            return fetchImgs().then(result => {
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
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImgListContainer)