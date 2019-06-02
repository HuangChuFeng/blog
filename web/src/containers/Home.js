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
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.someData !== this.state.someData
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
    const arr = [
      {
        id: 'first',
        text: 'IV'
      }, {
        id: 'second',
        text: 'HUSH'
      }, {
        id: 'third',
        text: 'OHIO'
      }, {
        id: 'forth',
        text: 'MYTH'
      }
    ]
    console.log('render');
    
    return (
      <div className="home-page">
        {
          arr.map((item, i) => {
            const imgStyle = {
              height: document.documentElement.clientHeight + 'px',
              backgroundImage: `url(${require("../static/img/img" +  Math.floor(Math.random()*17 + 1) + ".jpg")})`, 
              backgroundSize: 'cover'
            }
            return (
              <div key={i} id={item.id + 'Page'} className={'index-bg ' + item.id } style={ this.state.bgHeight }>
                <div className="img" style={ imgStyle }></div>
                <div className="mask" style={ this.state.bgHeight }>{ item.text }</div>
                { i === 0 &&
                <ul className="nav-ul">
                  <li><RouteLink to="/photograph">摄影</RouteLink></li>
                  <li><RouteLink to="/articles">博客</RouteLink></li>
                </ul>
                 }
              </div>
            )
          })
        }
        <Anchor>
          <ul className="anchor-list">
            <li><Link href="#firstPage" title="01"/></li>
            <li><Link href="#secondPage" title="02"/></li>
            <li><Link href="#thirdPage" title="03"/></li>
            <li><Link href="#forthPage" title="04"/></li>
          </ul>
        </Anchor>
      </div>
    )
  }
}