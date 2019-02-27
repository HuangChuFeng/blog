import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Anchor, Button } from 'antd';

import { login } from "../service/fetch";

import '../css/home.less'
const { Link } = Anchor;

export default class Home extends Component {
  constructor(props) {
      super(props);
      this.state = {
        bgHeight: {
          height: document.documentElement.clientHeight + 'px',
        }
      }
  }

  componentDidMount() {
      // 高度设置
      this.screenChange();
      login({name: 'admin', password: '123'}).then(result => {
          const {data} = result;
          if (data) {
            console.log('======', data)
          } 
      });
  }
  screenChange() {
    window.addEventListener('resize', () => {
      this.setState({ 
        bgHeight: {
          height: document.documentElement.clientHeight + 'px'
        }
      })
    });
  }
  render() {
    return (
      <div className="home-page">
        <div id="firstPage" className="index-bg first" style={ this.state.bgHeight }>
          <div className="img" style={ this.state.bgHeight }></div>
          <div className="mask" style={ this.state.bgHeight }></div>
          <div className="content-box">
            <span className="top-left-text">黄初凤</span>
            <span className="left-center-text"><a href="#">关于我—</a></span>
              <ul className="nav-ul">
                <li><a href="/photograph">摄影</a></li>
                <li><a href="#">视频</a></li>
                <li><a href="/articles">文章</a></li>
              </ul>
            <div className="center-text">
              <p>PHOTOGRAPH</p>
              <p>BLOG</p>
              <p>VIDEO</p>
            </div>
            <div className="bottom-center-text">
              <div className="line"></div>
              <div className="order-text">01</div>
              <Anchor>
                <Link href="#secondPage" className="to-bottom-link" title="向下滑动" />
              </Anchor>
            </div>
          </div>
        </div>
        <div id="secondPage" className="index-bg second" style={ this.state.bgHeight }>
          <div className="mask" style={ this.state.bgHeight }>
            <div className="img-wrap">
              <img src={require("../static/img/hand.jpeg")} alt=""/>
              <div className="describe-text">
                <p>hand-------------</p>
                <p>2018.11.22</p>
              </div>
            </div>
          </div>
          <div className="content-box">
            <span className="left-center-text">摄影—</span>
            <div className="center-text">
              <p>PHOTOGRAPH</p>
              <p>BLOG</p>
              <p>VIDEO</p>
            </div>
            <div className="left-content-wrap">
              <Button className="photo-btn"><a href="/photograph">照片集</a></Button>
              <div className="order-box">02</div>
            </div>
          </div>
        </div>
        <Anchor>
          <ul className="anchor-list">
            <li><Link href="#firstPage" title="01"/></li>
            <li><Link href="#secondPage" title="02"/></li>
            <li><Link href="#thirdPage" title="03"/></li>
            <li><Link href="#fourthPage" title="04"/></li>
          </ul>
        </Anchor>,
        mountNode
      </div>
    )
  }
}