import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Comment, Avatar, Form, Button, List, Input,
} from 'antd';
import moment from 'moment';

const TextArea = Input.TextArea;

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
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
  }
  
  componentWillMount() {
    console.log(this.props);
    this.setState({
      comments: this.props.comments
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
        content: this.state.value
      }, (result) => {
        if(result.data.comment) {
          let resComment = result.data.comment;
          this.setState({
            submitting: false,
            value: '',
            comments: [
              {
                author: window.localStorage.getItem('user'),
                avatar: resComment.avatar || '',
                content: <p>{ this.state.value }</p>,
                datetime: resComment.created_at,
              },
              ...this.state.comments,
            ],
          });
          console.log(this.state.comments);
          
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
      return {
        author: `来自${item.user.source}的${item.user.name}`,
        avatar: item.user.avatar || '',
        content: <p>{ item.content }</p>,
        datetime: item.created_at,
      }
    })
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