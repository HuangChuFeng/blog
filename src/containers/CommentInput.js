import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import CommentInput from '../components/CommentInput'
import { addComment } from '../reducers/comments'

class CommentInputContainer extends Component {
    static propTypes = {
        comments: PropTypes.array,
        onSubmit: PropTypes.func,
    }

    constructor() {
        super();
        this.state = {
            username: ''
        }
    }

    componentWillMount() {
        this._loadUsername();
    }

    _loadUsername() {
        const username = localStorage.getItem('username');
        if(username) {
            this.setState({ username })
        }
    }

    _saveUsername(username) {
        localStorage.setItem('username', username)
    }

    handleSubmitComment(comment) {
        if(!comment) return;
        if(!comment.username) return alert('请输入用户名');
        if(!comment.content) return alert('请输入评论内容');
        const { comments } = this.props;
        const newComments = [...comments, comment];
        localStorage.setItem('comments', JSON.stringify(newComments));
        if(this.props.onSubmit) {
            this.props.onSubmit(comment)
        }
    }

    render () {
        console.log(this.state.username)
        return (
          <CommentInput
            username={this.state.username}
            onUserNameInputBlur={this._saveUsername.bind(this)}
            onSubmit={this.handleSubmitComment.bind(this)} />
        )
    }
}

/* 此处传这个两个函数进入Connect中相当于是：
 * 在这个组件中没有state这个状态变量， 如果要取出来的话， 其他组件也会像这样再执行一样的取出操作
 * 所以单独把这个操作封装起来， 在Connect中拿到这个state, 执行外部传入的函数，返回新的含有数据的高阶组件
 * 
 */

const mapStateToProps = (state) => {
    return {
        comments: state.comments  // 告诉Connect组件我们需要什么数据
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // 告诉Connect组件我们要执行什么操作， 传入onSubmit函数在Connect组件中执行
        onSubmit: (comment) => {
            dispatch(addComment(comment));
        }
    }
}


/* connect函数接受一个组件，这里是CommentInputContainer，作为参数把这个组件包含在一个新的组件
 * 把这个组件包含在一个新的组件Connect里面，Connect会去context里面取出store, 然后把store里面
 * 的数据取出通过props传给CommentInputContainer
 * 函数返回新的含有数据的高阶组件
 * */

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CommentInputContainer)