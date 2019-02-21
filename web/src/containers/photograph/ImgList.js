import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { initImgs, deleteImg } from '../../reducers/imgs'
import { Affix, Icon } from 'antd';
import ImgList from '../../components/photograph/ImgList'
import Header from '../../components/Header'
import '../../css/img.less'

import { fetchImgs } from "../../service/fetch";

class ImgListContainer extends Component {

    componentWillMount() {
        this._loadimgs();
    }

    _loadimgs() {
        this.props.initImgs(this.props.imgs);
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
                <ImgList
                    imgs= {this.props.imgs}
                    onDeleteComment= {this.handleDeleteComment.bind(this)} />
            </div>
        )
    }
}

// 当前组件需要的state数据
const mapStateToProps = (state) => {
    return {
        imgs: state.imgs
    }
}
  
// 当前组件需要发起是事件
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
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ImgListContainer)