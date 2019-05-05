import React, { Component } from 'react'
import { Anchor } from 'antd';
import { Link as RouteLink } from 'react-router-dom';
import { getLocation } from "../service/fetch";
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
      // this.getLocationCity();
  }

  getLocationCity() {
    getLocation().then(result => {
        // console.log('获取当前城市', result)
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
          <div className="mask" style={ this.state.bgHeight }>IV</div>
          <ul className="nav-ul">
            <li><RouteLink to="/photograph">摄影</RouteLink></li>
            <li><RouteLink to="/articles">博客</RouteLink></li>
          </ul>
        </div>
        <div id="secondPage" className="index-bg second" style={ this.state.bgHeight }>
          <div className="img" style={ this.state.bgHeight }></div>
          <div className="mask" style={ this.state.bgHeight }>HUSH</div>
        </div>
        <div id="thirdPage" className="index-bg third" style={ this.state.bgHeight }>
          <div className="img" style={ this.state.bgHeight }></div>
          <div className="mask" style={ this.state.bgHeight }>OHIO</div>
        </div>
        <div id="fourthPage" className="index-bg forth" style={ this.state.bgHeight }>
          <div className="img" style={ this.state.bgHeight }></div>
          <div className="mask" style={ this.state.bgHeight }>MYTH</div>
        </div>
        
        <Anchor>
          <ul className="anchor-list">
            <li><Link href="#firstPage" title="01"/></li>
            <li><Link href="#secondPage" title="02"/></li>
            <li><Link href="#thirdPage" title="03"/></li>
            <li><Link href="#fourthPage" title="04"/></li>
          </ul>
        </Anchor>
      </div>
    )
  }
}