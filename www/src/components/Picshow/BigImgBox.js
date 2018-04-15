import React from "react";
import {connect} from "dva";
import Slider from "react-slick";
import "./Picshow.less";

class BigImgBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    };
    //图片的地址
    this.src = "";
    this.err = false;
  }
  
  shouldComponentUpdate(nextProps,nextState) {
    // console.log("shouldComponentUpdatebigImgBox");
    let { nowid, nowidx, nowalbum, houseinfo , allImgs , dirarr} = nextProps;
    // console.log(nextProps);
    // console.log(this.props);
    
    //这里要看看this.props.houseinfo.rooms是不是undefined，如果是不再继续渲染了
    if(!houseinfo.rooms || !allImgs.length || !dirarr.length) return false;
    //如果nowid变化了，此时就必须houseinfo发生变化
    //如果nowid变化了，但是houseinfo没变，就说明houseinfo还在没有请求回来呢。
    if(nowid != this.props.nowid && nowid != houseinfo.id && allImgs == this.props.allImgs && dirarr == this.props.dirarr){
      return false;
    }
    if(allImgs != this.props.allImgs && dirarr!= this.props.dirarr){
      // console.log("分支"+1);
      return true;
    }else if(allImgs == this.props.allImgs && dirarr == this.props.dirarr && nowid == houseinfo.id){
      if(nowidx != this.props.nowidx || nowalbum != this.props.nowalbum){
        // console.log("分支"+2);
        return true;
      }
      // console.log("分支"+3);
    }
    if(nextState != this.state){
      // console.log("state更新"+3);
      return true;
    }
    // console.log("默认不更新");
    return false;
  }
  componentWillUpdate(nextProps) {
    // console.log("componentWillUpdatebigImgBox");
    // if (!nextProps.houseinfo.rooms) return;
    let { nowid, nowidx, nowalbum, houseinfo , allImgs , dirarr} = nextProps;
    let imagefilename = "";
    let roompath = "";
    //判断当前图集是卧室还是其他区域
    if (Number(nowalbum) >=0 ) {
      roompath = houseinfo.rooms[nowalbum].path;
      imagefilename = houseinfo.rooms[nowalbum].images[nowidx];
    } else if (nowalbum === "otherviews") {
      roompath = "otherviews";
      imagefilename = houseinfo.otherviews[nowidx];
    }
    //先用小图充当
    $(this.refs.bigimg).attr("src", `images/room_images_small/${nowid}/${roompath}/${imagefilename}`);
    //************loading图显示************
    //发出对image的请求，只有这么写才能得到image的load事件回调
    let image = new Image();
    image.src = `images/room_images/${nowid}/${roompath}/${imagefilename}`;

    let self = this;
    image.onload = function () {
      //设置大图的src
      $(self.refs.bigimg).attr("src", image.src);
      //如果image的src和上一次一样，阻止渲染，为了防止死循环
      if (image.src == self.src) return;
      self.src = image.src;
      //隐藏loading图片
      self.setState({
        loaded: true
      });
    }
    image.onerror = function () {
      console.log("image.onerror");
      this.err = true;
    }
    //***************实现预先加载***************
    //从合并的数组中找到哪一张是我自己？此时这个序号就是我在总图集的总序号
    const totalNum = allImgs.indexOf(imagefilename);
    //循环终点
    const loopend = totalNum + 3 < allImgs.length ? totalNum + 3 : allImgs.length;

    //预先加载后面3张
    for (let j = totalNum; j < loopend; j++) {
      // if(allImgs.indexOf(imagefilename) == -1) return;
      // console.log(imagefilename);
      let _image = new Image();
      _image.src = `images/room_images/${nowid}/${dirarr[j]}/${allImgs[j]}`;
      _image.onerror = function () {
        console.log("_image.onerror");
        this.err = true;
      }
    }
    //向外暴露两个数值
    this.totalNum = totalNum;
    this.total = allImgs.length;
  }
  
  render() {
    // console.log("renderBigImgBox");
    let {houseinfo, nowid, nowidx, dispatch} = this.props;
    let {loaded} = this.state;
    return (<div className={"bigImgBox"}>
      <div className="inner">
					<img ref="bigimg"  className="bigimg" />
					
					<div className="leftbtn" onClick={()=>{
						dispatch({"type":"picshow/goPrev"});
						//点击按钮的时候让文字出现
						this.setState({
							loaded : false
						})
					}}></div>

					<div className="rightbtn" onClick={()=>{
						dispatch({"type":"picshow/goNext"})
						//点击按钮的时候让文字出现
						this.setState({
							loaded : false
						})
					}}></div>

					{!loaded && <div className="loadtip"></div>}
					<div className="nobox">
						{this.totalNum >= 0 ? (this.totalNum + 1) +"/"+this.total : null}
					</div>
				</div>
      </div>
    );
  }
}


export default connect(
  ({picshow}) => ({
    nowid: picshow.nowid,
    nowidx: picshow.nowidx,
    nowalbum: picshow.nowalbum,
    houseinfo: picshow.houseinfo
  })
)(BigImgBox);