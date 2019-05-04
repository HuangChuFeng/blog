import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Spin } from 'antd';

export default class Loading extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    static propTypes = {
        show: PropTypes.bool,
        loadMore: PropTypes.func,
    }

    handleClick() {
        this.props.loadMore()
    }

    render() {
        const text = this.props.show ? '正在加载' : '加载更多';
        return (
            <div className="loading-wrap">
            { this.props.show &&
                <Spin size="small" />
            }
                <span onClick={this.handleClick.bind(this)}>{ text } </span>
            </div>
        )
    }
}