import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initImgs, deleteImg, addImg } from '../../reducers/imgs'
import { Affix, Icon, Button } from 'antd';
import ImgList from '../../components/photograph/ImgList'
import UploadImg from '../../components/photograph/UploadImg'
import Header from '../../components/Header'
import '../../css/img.less'

import { fetchImgs } from "../../service/fetch";

class ImgListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogVisible: false,
        }
    }
    componentWillMount() {
        this._loadimgs();
    }

    _loadimgs() {
        this.props.initImgs(this.props.imgs);
    }

    visibleHandler = (flag) => {
        this.setState({ dialogVisible: flag });
    }

    handleDeleteComment(index) {
        const { imgs } = this.props;
        const newimgs = [
            ...imgs.slice(0, index),
            ...imgs.slice(index + 1)    
        ];

        // 处理数据源
        localStorage.setItem('imgs', JSON.stringify(newimgs));

        // 从页面上删除
        if(this.props.onDeleteComment) {
            this.props.onDeleteComment(index);
        }
    }

    render () {
        return (
            <div>
                <Header type="0" />
                <div className="container img-container">
                    <Button type="primary" className="common-btn" onClick={this.visibleHandler.bind(this, true)}>
                        上传照片
                    </Button>
                    <UploadImg visible={this.state.dialogVisible} visibleHandler={this.visibleHandler}/>
                    <ImgList
                        imgs= {this.props.imgs}
                        onDeleteComment= {this.handleDeleteComment.bind(this)} />
                </div>
            </div>
        )
    }
}

// 当前组件需要的state数据
const mapStateToProps = (state) => {
    return {
        imgs: state.imgsReducer.imgs
    }
}
  
// 当前组件需要发起的事件
const mapDispatchToProps = (dispatch) => {
    return {
        initImgs: (imgs) => {
            if(imgs && imgs.length === 0) {
                return fetchImgs(imgs).then(result => {
                    const {data} = result;
                    if (data) {
                        dispatch(initImgs(data.imgs));
                    } 
                });
            } else {
                dispatch(initImgs([]));
            }
        },
        onDeleteComment: (commentIndex) => {
            // dispatch(deleteComment(commentIndex))
        },
        deleteImg: (imgIndex) => {
            dispatch(deleteImg(imgIndex))
        },
        addImg: (img) => {
            dispatch(addImg(img))
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImgListContainer)