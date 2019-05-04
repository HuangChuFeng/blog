import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Comment, Avatar, Form, Button, List, Input,
} from 'antd';
// import moment from 'moment';

const TextArea = Input.TextArea;
const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} 条评论`}
    itemLayout="horizontal"
    renderItem={props => <Comment {...props} />}
  />
);

const Editor = ({
  onChange, onSubmit, submitting, value,
}) => (
    <div>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
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
    value: '',
    comments: [],
  }

  static propTypes = {
    onSubmit: PropTypes.func,
    comments: PropTypes.array,
    receiver: PropTypes.string
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
      this.props.onSubmit({
        receiver: this.props.receiver,
        content: this.state.value
      }, (result) => {
        if (result.data && result.data.comment) {
          let resComment = result.data.comment;
          let author = '';
          if(resComment.sender === this.props.receiver) {
            author = '作者'
          } else{
            author = window.localStorage.getItem('user');
          }
          this.setState({
            submitting: false,
            value: '',
            comments: [
              {
                author,
                avatar: resComment.avatar || '',
                content: this.state.value,
                created_at: resComment.created_at,
              },
              ...this.state.comments,
            ],
          });
          
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

  render() {
    const { submitting, value } = this.state;
    const comments = this.state.comments.map(item => {
      let avatar = '', res;
      if (item.user && item.user.avatar) {
        avatar = item.user.avatar;
      }
      item.avatar && (avatar = item.avatar);
      res = {
        avatar: avatar,
        content: <p>{item.content}</p>,
        datetime: item.created_at,
      }
      if(item.sender === this.props.receiver) {
        res.author = '作者'
      } else {
        res.author = item.author || item.senderInfo
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
            />
          )}
        />
      </div>
    );
  }
}