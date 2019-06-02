import React, { Component } from 'react'
import { Icon } from 'antd';
import Header from '../components/Header'
import { connect } from 'react-redux'
import { changeCurNav } from '../reducers/common'
class Footer extends Component {
componentWillMount() {
    setTimeout(() => {
        this.props.changeCurNav('关于')
    }, 0)  
}
  render() {
    return (
        <div>
            <Header />
            <div className="container">
                <div className="about-me">
                    <img className="avator" alt="" src={require('../static/img/avator.jpeg')} />
                    <div>
                        <p>麻烦让我一夜暴富 实在不行的话 半个月也行 一年也可以</p>
                        <p><a target="blank" href="https://github.com/HuangChuFeng"><Icon type="github" /> <span>github</span></a>&nbsp;&nbsp;&nbsp;&nbsp;
                        <a target="blank" href="https://weibo.com/5454891945/profile"><Icon type="weibo-circle" /> <span>__cranky</span></a></p>
                    </div>
                </div>
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
        changeCurNav: (nav) => {
            dispatch(changeCurNav(nav));
        },
    }
}
  
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Footer)