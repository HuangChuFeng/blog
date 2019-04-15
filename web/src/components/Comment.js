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
          type="primary"
        >
          评论
      </Button>
      </Form.Item>
    </div>
  );
export default class MyComment extends Component {
  state = {
    comments: [{
      author: '5c73933ffb58df995bc53926',
      avatar: 'http://pnmpntc1j.bkt.clouddn.com/Ftjy41MK6nPmG8HS9KVcQSxZSXzL',
      content: <p>1111111111111</p>,
      datetime: moment().fromNow(),
    }],
    submitting: false,
    value: '',
  }

  static propTypes = {
    onSubmit: PropTypes.func,
    comments: PropTypes.array,
  }

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }
    this.setState({
      submitting: true,
    });

    this.props.onSubmit({
      author: '5c73933ffb58df995bc53926',
      content: this.state.value
    });

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: '',
        comments: [
          {
            author: 'Han Solo',
            avatar: 'http://pnmpntc1j.bkt.clouddn.com/Ftjy41MK6nPmG8HS9KVcQSxZSXzL',
            content: <p>{this.state.value}</p>,
            datetime: moment().fromNow(),
          },
          ...this.state.comments,
        ],
      });
    }, 1000);
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  render() {
    const { comments, submitting, value } = this.state;

    return (
      <div>
        {comments.length > 0 && <CommentList comments={comments} />}
        <Comment
          avatar={(
            <Avatar
              src="http://pnmpntc1j.bkt.clouddn.com/Ftjy41MK6nPmG8HS9KVcQSxZSXzL"
              alt="Han Solo"
            />
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