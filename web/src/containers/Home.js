import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Anchor, Button } from 'antd';
import { Link as RouteLink } from 'react-router-dom';

import { login, getLocation } from "../service/fetch";

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
      this.getLocationCity();
      // login({name: 'admin', password: '123'}).then(result => {
      //     const {data} = result;
      //     if (data) {
      //       console.log('======', data)
      //     } 
      // });
  }

  getLocationCity() {
    getLocation().then(result => {
      // const {data} = result;
      // if (data) {
        console.log('获取当前城市', result)
      // } 
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
            <span className="top-left-text">____________</span>
            <span className="left-center-text"><a href="#">关于—</a></span>
              <ul className="nav-ul">
                <li><RouteLink to="/photograph">摄影</RouteLink></li>
                <li><RouteLink to="#">视频</RouteLink></li>
                <li><RouteLink to="/articles">文章</RouteLink></li>
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
              <Button className="photo-btn"><RouteLink to="/photograph">照片集</RouteLink></Button>
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