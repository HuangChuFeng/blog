import React, { Component } from 'react'
import { Icon } from 'antd';
import Header from '../components/Header'
import Footer from '../components/Footer'
import { connect } from 'react-redux'
import { changeCurNav, changeShowMusic } from '../reducers/common'
class About extends Component {
    componentWillMount() {
        setTimeout(() => {
            this.props.changeCurNav('关于')
        }, 0)  
        this.props.changeShowMusic(true)
    }
    changeSong() {
        this.props.changeShowMusic(false)
        setTimeout(() => {
            this.props.changeShowMusic(true)
        }, 0)  
    }
  render() {
    return (
        <div>
            <Header />
            <div className="about-me">
                <img className="avator" alt="" src={require('../static/img/avator.jpeg')} />
                <div>
                    <p>麻烦让我一夜暴富 实在不行的话 半个月也行 一年也可以</p>
                    <p><a target="blank" href="https://github.com/HuangChuFeng"><Icon type="github" /> <span>github</span></a>&nbsp;&nbsp;&nbsp;&nbsp;
                    <a target="blank" href="https://weibo.com/5454891945/profile"><Icon type="weibo-circle" /> <span>__cranky</span></a></p>
                    <p onClick={this.changeSong.bind(this)}><span className="change-song-btn">换歌</span></p>
                </div>
                <Footer />
            </div>
        </div>
    )
  }
}
const mapStateToProps = (state) => {
    return {
        curNav: state.commonReducer.curNav,
    }
}
  
const mapDispatchToProps = (dispatch) => {
    return {
        changeShowMusic: (show) => {
            dispatch(changeShowMusic(show));
        },
        changeCurNav: (nav) => {
            dispatch(changeCurNav(nav))
        }
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(About)