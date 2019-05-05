import React, { Component } from 'react'

const musics = ['3940933', '3947469', '428350031', '448917907', '19466001', '29729012', '16649839', '1651735', '21469678', '410925920', 
'425684928', '466333783', '400690256', '19535983', '4405800', '3947469', '4111185', '18861490', '462516170', '417833085'];
export default class Home extends Component {
  render() {
    return (
      <div className="music-wrap">
        <iframe id="musicFrame" title="music" frameBorder="no" border="0" marginWidth="0" marginHeight="0" width="200" height="86"
         src={`//music.163.com/outchain/player?type=2&id=${musics[Math.floor(Math.random()*musics.length)]}&auto=1&height=66`}>
        </iframe>
      </div>
    )
  }
}