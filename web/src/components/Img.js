import React, { Component } from 'react'

import PropTypes from 'prop-types'

export default class Img extends Component {
    static propTypes = {
        img: PropTypes.shape({
            src: PropTypes.string
        })
        // img: PropTypes.object
    }

    static defaultProps = {
        img: null,
    }

    handleDeleteComment(index) {
        if(this.props.onDeleteComment) {
            this.props.onDeleteComment(index)
        }
    }

    render() {
        var src = require("../static/img/img1.jpg");
        return (
            <div className="img-wraper">
                <img src={require(`${this.props.img.src}`)} alt="image"/>
            </div>
        )
    }
}

