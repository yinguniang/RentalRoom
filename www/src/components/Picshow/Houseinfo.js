import React from 'react';
import {connect} from 'dva';
import { Rate } from 'antd';
// import style from "./Picshow.less";
import "./Picshow.less";

class Houseinfo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let {houseinfo, nowidx, nowalbum,dispatch} = this.props;
    if (!houseinfo.rooms)  return null;
    let {estate,rooms,roomAmount,orientation,area,areadetail,stars,subway,station,floor,price,floorspace} = houseinfo;
    let roomname = "卧室1";
    if(Number(nowalbum) >= 0){
      roomname = rooms[nowalbum].room_name;
    }else if(nowalbum == "otherviews"){
      roomname = "其他区域";
    }
    if(stars > 12) stars = 12;
    return (
      <div className={"houseinfo"}>
        <div className={"upInfo"}>
          <h2>
          {estate}小区{roomAmount}居室-{roomname}
        </h2>
          <p>{"[" + area + "区" + areadetail + "] " + subway[0] + " " + station}</p>
          <span><b>￥{price}</b>元/月(季付)</span>
        </div>
        <div className={"downInfo"}>
          <ul className={"detail"}>
            <li className={"detailli"}>面积：{floorspace}㎡</li>
            <li className={"detailli"}>朝向：{orientation}</li>
            <li className={"detailli"}>户型：{roomAmount}室1厅</li>
            <li className={"detailli"}>楼层：第{floor}层</li>
            <li className={"detailli"}>评分：<Rate disabled allowHalf value={stars} count={6} /></li>
          </ul>
        </div>
      </div>
    );
  }
}

export default connect(
  ({picshow}) => ({
    houseinfo: picshow.houseinfo,
    nowidx: picshow.nowidx,
    nowalbum: picshow.nowalbum
  })
)(Houseinfo);