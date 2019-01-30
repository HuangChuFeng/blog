import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Anchor, Button } from 'antd';

const { Link } = Anchor;

export default class Home extends Component {
  static propTypes = {
    bgHeight: PropTypes.object,
  }

  static defaultProps = {
    bgHeight: {},
  }

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
            <span className="left-center-text">关于我—</span>
              <ul className="nav-ul">
                <li><a href="#" />摄影</li>
                <li><a href="#" />视频</li>
                <li><a href="#" />文章</li>
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
                  <Link href="#secondPage" title="向下滑动" />
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
            <div className="img-wrap">
              <div className="describe-text">
                <p>light------------</p>
                <p>2018.11.22</p>
              </div>
            <img src={require("../static/img/light.jpeg")} alt=""/>
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
              <Button className="common-btn photo-btn">Default</Button>
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