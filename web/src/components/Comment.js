import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Comment, Avatar, Form, Button, List, Input,
} from 'antd';
// import moment from 'moment';

const TextArea = Input.TextArea;
const CommentList = ({ comments }) => {
  let count = comments.length;
  console.log('count', count);
  
  if(count > 1) {
    count += comments.reduce((prev, next) => {
      console.log('prev', prev, next);
      return (prev.child ? prev.child.length : 0) + (next.child ? next.child.length : 0)
    }, 0)
  } else if(comments[0].child) {
    count += comments[0].child.length
  }
  return (<List
    dataSource={comments}
    header={`${count} 条评论`}
    itemLayout="horizontal"
    renderItem={ props => {
      return (<Comment {...props} >
        { props.child && props.child.length && 
          (<List
            dataSource={props.child}
            itemLayout="horizontal"
            renderItem={ props => (
              <Comment {...props} />
            )
          }
          />)
        }
      </Comment>)
    }
  }
  />)
};

const Editor = ({
  onChange, onSubmit, submitting, value, placeholder
}) => (
    <div>
      <Form.Item>
        <TextArea placeholder={placeholder} rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button
          className="common-btn"
          htmlType="submit"
          loading={submitting}
          onClick={onSubmit}
          type="primary">
          评论
        </Button>
      </Form.Item>
    </div>
  );
export default class MyComment extends Component {
  state = {
    submitting: false,
    value: '',  // 评论内容
    comments: [],
    placeholder: '输入评论内容...',
    receiver: null,
    belongId: '', // 属于哪条初始评论
  }

  static propTypes = {
    type: PropTypes.number, // 1: 摄影, 0: 文章
    onSubmit: PropTypes.func,
    comments: PropTypes.array,
    receiver: PropTypes.string   // 默认接受者是作者
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      comments: nextProps.comments
    })
  }

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    } else {
      this.setState({
        submitting: true,
      });
      let params = {
        type: this.props.type,
        receiver: this.state.receiver || this.props.receiver,
        content: this.state.value,
        belongId: this.state.belongId
      }
      this.props.onSubmit(params, (result) => {
        if (result.data && result.data.comment) {
          let resComment = result.data.comment;
          let author = '';
          if(resComment.sender === this.props.receiver) {
            author = '作者'
          } else{
            author = window.sessionStorage.getItem('user');
          }
          let curComment = {
            author,
            avatar: resComment.avatar || '',
            content: this.state.value,
            created_at: resComment.created_at,
          }
          if(params.belongId) {
            this.state.comments.forEach(item => {
              if(item._id + '' === params.belongId) {
                curComment.author += `回复@作者`
                item.child = [
                  curComment,
                  ...item.child
                ]
                return false;
              }
            })
            this.setState({
              submitting: false,
              value: '',
              comments: this.state.comments
            });
          } else {
            this.setState({
              submitting: false,
              value: '',
              comments: [
                curComment,
                ...this.state.comments,
              ]
            });
          }
        } else {
          this.setState({ submitting: false })
        }
      });
    }
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  // 回复评论
  replay(belongId, sender, senderInfo) {
    if(this.props.receiver === sender) {
      senderInfo = '作者';
    }
    this.setState({
      placeholder: `回复${senderInfo} :`,
      receiver: sender,
      belongId
    });
  }

  // 查找接收用户的名称
  queryReceiverName(belongId) {
    let name = '';
    this.state.comments.forEach(item => {
      if(item._id === belongId) {
        name = item.senderInfo;
        return false;
      }
    })
    return name;
  }

  // 评论配置
  configComment(item) {
    let avatar = '', res;
    if (item.user && item.user.avatar) {
      avatar = item.user.avatar;
    }
    item.avatar && (avatar = item.avatar);
    res = {
      avatar: avatar,
      content: <p>{item.content}</p>,
      datetime: item.created_at,
      child: item.child
    }
    // 接收者是自己时显示回复按钮
    if(item.isReceiver) {
      res.actions = [ <span onClick={this.replay.bind(this, item.belongId || item._id, item.sender, item.author || item.senderInfo)}>回复</span>]
    }
    if(item.sender === this.props.receiver) {
      res.author = '作者'
    } else {
      res.author = item.author || item.senderInfo
    }
    if(item.belongId) {
      let name = this.queryReceiverName(item.belongId);
      if(name === res.author) {
        name = '作者';
      }
      res.author += `回复@${name}`
    }
    return res;
  }

  render() {
    const { submitting, value, placeholder } = this.state;
    const comments = this.state.comments.map(item => {
      let res = this.configComment(item)
      if(item.child) {
        res.child = item.child.map(item1 => {
          return this.configComment(item1)
        })
      }
      return res;
    }); 
    
    return (
      <div>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          avatar={(
            <Avatar src="" alt="" />
          )}
          content={(
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
              placeholder={placeholder}
            />
          )}
        />
      </div>
    );
  }
}