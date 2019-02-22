import React, { Component } from 'react'

import PropTypes from 'prop-types'
import { Icon } from 'antd';


const bgColors = ['#6A0AAB', '#C7007D', '#3415B0', '#44036F', '#4013AF', '#A600A6', '#6C006C'];

export default class Img extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgColor: bgColors[Math.floor(Math.random()*bgColors.length)]
        }
    }

    static contextTypes = {
        router: PropTypes.object.isRequired,
    }

    static propTypes = {
        img: PropTypes.shape({
            src: PropTypes.string,
        }),
    }

    static defaultProps = {
        img: null
    }

    handleDeleteComment(index) {
        if(this.props.onDeleteComment) {
            this.props.onDeleteComment(index)
        }
    }

    imgOnLoad = () => {
        console.log('img onload');
        
    }

    // 查看图片详情
    toImgDetailPage = id =>  {
        this.context.router.history.push(`/photograph/${id}`);       
    }

    render() {
        return (
            <div className="img-wraper" onClick={this.toImgDetailPage.bind(this, this.props.img.id)}>
                <img src={require('../../' + this.props.img.src)} alt=""
                onLoad={this.imgOnLoad.bind(this)} />

                <div className="img-cover">
                    <div className="operate-box">
                       <div>
                            <Icon className="heart-icon" type="heart" /> 
                            <span className="count-span">50</span>
                            <Icon type="switcher" className="collection-icon" />
                       </div>
                    </div>
                    <div className="info-box">
                        名称
                    </div>
                </div>
            </div>
        )
    }
}

