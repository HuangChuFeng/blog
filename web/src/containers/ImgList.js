import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImgList from '../components/ImgList'
import { initImgs, deleteImg } from '../reducers/imgs'
import { Affix, Menu, Dropdown, Icon } from 'antd';
import '../css/img.less'

import { fetchImgs } from "../service/fetch";

const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="#">所有排序</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="#">时间排序</a>
      </Menu.Item>
    </Menu>
  );

class ImgListContainer extends Component {
    static propTypes = {
        // imgs: PropTypes.arrayOf(PropTypes.shape({
        //     src: PropTypes.string
        // })),
        imgs: PropTypes.array,
        onSubmit: PropTypes.func
    }

    componentWillMount() {
        this._loadimgs();
    }

    _loadimgs() {
        let imgs = localStorage.getItem('imgs');
        imgs = imgs ? JSON.parse(imgs) : [];
        this.props.initImgs(imgs);
        localStorage.setItem('imgs', JSON.stringify(imgs));
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
                <div className="img-page-header">
                    <ul className="img-nav-ul">
                        <li className="active">
                            <Dropdown overlay={menu} trigger={['click']}>
                                <span>所有照片<Icon type="down" /></span>
                            </Dropdown>
                        </li>
                        <li>建筑</li>
                        <li>人像</li>
                        <li>街拍</li>
                        <li>风景</li>
                    </ul>
                    <a href="/" className="to-index-link">主页 <Icon type="home" /></a>
                </div>
                <ImgList
                    imgs= {this.props.imgs}
                    onDeleteComment= {this.handleDeleteComment.bind(this)} />
            </div>
        )
    }
}

// 发给子组件的状态
const mapStateToProps = (state) => {
    return {
        imgs: state.imgs
    }
}
  
// 发给子组件的事件
const mapDispatchToProps = (dispatch) => {
    return {
        initImgs: (imgs) => {
            return fetchImgs(imgs).then(result => {
                const {data} = result; // 取result的data属性值
                if (data) {
                  dispatch(initImgs(data.imgs));
                } 
              });
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