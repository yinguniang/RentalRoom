import React from 'react';
import {connect} from "dva";
import App from "../../containers/App.js";
import "./Picshow.less";

import Houseinfo from "./Houseinfo.js";
import BigImgBox from "./BigImgBox.js";
import Smallpics from "./Smallpics.js";
import Houselikes from "./Houselikes.js";
import Roominfo from "./Roominfo.js";

class Picshow extends React.Component {
  constructor(props) {
    super(props);
    //构造函数中发出请求，请求服务器的默认数据
    props.dispatch({"type": "picshow/init", "nowid": props.match.params.id});
    // 大小图的信息传递
    this.state={
      allImgs : [],
      dirarr : []
    };
  }
  
  componentWillReceiveProps(nextprops){
    let {houseinfo,nowid} = nextprops;
    if (houseinfo.rooms && (houseinfo !== this.props.houseinfo)) {
      let _allImgs = [];
      let _dirarr = [];
      //此时要把图片队列链接起来,定义图片数组和文件夹数组
      for (let i = 0, length = houseinfo.rooms.length; i < length; i++) {
        _allImgs = _allImgs.concat(houseinfo.rooms[i].images);
        _dirarr = _dirarr.concat(Array(houseinfo.rooms[i].images.length).fill(houseinfo.rooms[i].path));
      }
      _allImgs = _allImgs.concat(houseinfo.otherviews);
      _dirarr = _dirarr.concat(Array(houseinfo.otherviews.length).fill("otherviews"));
      this.setState({
        "allImgs" : _allImgs,
        "dirarr" : _dirarr
      });
    }
  }
  render() {
    let {allImgs , dirarr} = this.state;
    let {houseinfo} = this.props;
    
    let roomInfoArr = [];
    // console.log(houseinfo.rooms);
    if(houseinfo.rooms && houseinfo.roomAmount){
      roomInfoArr = Array(houseinfo.roomAmount);
      for(let i=0,length=roomInfoArr.length;i<length;i++){
        roomInfoArr[i] = houseinfo.rooms[i];
      }
    }
    console.log(allImgs);
    console.log(dirarr);
    return (<App>
      <div className={"picshow"}>
       
          <div className={"leftpart"}>
            <BigImgBox allImgs={allImgs} dirarr={dirarr} />
            <Smallpics allImgs={allImgs} dirarr={dirarr} />
          </div>

        <div className={"rightpart"}>
          <Houseinfo />
          <div className={"center"}>
            {roomInfoArr.length && roomInfoArr.map((item,index)=><Roominfo key={index} item={item} index={index} />)}        
          </div>
          <Houselikes />
        </div>
      </div>
      </App>
    )
  }
}

export default connect(
  ({picshow,routing}) => ({
    houseinfo: picshow.houseinfo,
    nowid: picshow.nowid,
    location : routing.location
  })
)(Picshow);
