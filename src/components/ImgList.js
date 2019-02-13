import React, { Component } from 'react'
import Img from './Img'

import PropTypes from 'prop-types'
import { Affix } from 'antd';

export default class ImgList extends Component {
    static propTypes = {
        imgs: PropTypes.array
    }

    static defaultProps = {
        imgs: []
    }

    handleDeleteComment(index) {
        if(this.props.onDeleteComment) {
            this.props.onDeleteComment(index)
        }
    }

    render() {
        return (
            <div>
                {this.props.imgs.map((comment, i) =>
                <Img
                    comment={comment}
                    key={i}
                    index={i}
                    onDeleteComment={this.handleDeleteComment.bind(this)} />
                )}
            </div>
        )
    }
}

