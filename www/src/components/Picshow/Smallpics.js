import React from 'react';
import {connect} from "dva";
import Slider from "react-slick";
import classnames from "classnames";
import "./Picshow.less";

class Smallpics extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(folder,filename){
    let {houseinfo,dispatch} = this.props;
    if(/^room[1-9]$/.test(folder)){
      let num = folder.substr(4,1);
      for(let i=0,length=houseinfo.rooms[num-1].images.length ; i<length ; i++){
        if(houseinfo.rooms[num-1].images[i] == filename){
          console.log("nowalbum"+num-1);
          dispatch({"type" : "picshow/changealbum" , "nowalbum" : num - 1 ,"nowidx" : i});
        }
      }
    }else if(folder == "otherviews"){
      for(let j=0,length=houseinfo.otherviews.length ; j<length ; j++){
        if(houseinfo.otherviews[j] == filename){
          console.log("nowidx"+j);
          dispatch({"type" : "picshow/changealbum" , "nowalbum" : "otherviews" ,"nowidx" : j});
        }
      }
    }
  }
  
  shouldComponentUpdate(nextProps) {
    console.log("shouldComponentUpdate_smallpic");
    let { nowid, nowidx, nowalbum, houseinfo , allImgs , dirarr} = nextProps;
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
    return false;
  }
  
  render() {
    let {houseinfo, nowid, nowidx, nowalbum, dispatch, allImgs , dirarr} = this.props;
    if (!allImgs.length) return null;
    const settings = {
      infinite: true,
      slidesToShow: 3,
      slidesToScroll: 1,
      initialSlide: 1,
      swipeToSlide: true,
      focusOnSelect: true,
      className: "center",
      centerMode: true,
      centerPadding: "30px",
      variableWidth: true
    };
    const showSmallpics = () => {
      let tempArr = allImgs.map((item, index) => {
        return (
          <div key={index}>
              <img src={`images/room_images_small/${nowid}/${dirarr[index]}/${allImgs[index]}`} 
                    onClick={()=>this.handleClick(dirarr[index],allImgs[index])}
              />
          </div>
        )
      });
      return tempArr;
    };
    return (
      <div className={"smallpics"}>
        <Slider {...settings} beforeChange={(currentSlide, nextSlide)=>{
          console.log(this);
          console.log('before change', currentSlide, nextSlide);
        }}>
          {showSmallpics()}
        </Slider>
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
)(Smallpics);