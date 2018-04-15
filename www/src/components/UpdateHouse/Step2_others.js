import React from "react";
import {connect} from "dva";
import {Row, Col,Icon,Button} from "antd";

class Step2_others extends React.Component {
  constructor() {
    super();
  }
  
   //上传DOM业务
   _createFileReaderAndUpload(files) {
    if (!files.length) return;
    if (files.length > 9) {
      alert("最多同时只可上传9张图片");
      return;
    }
    var self = this;
     // 缩放图片需要的canvas
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    for (let i = 0; i<files.length; i++) {
      //这是给这个被遍历小图做的盒子
      let $div = $(`<div class="preDiv"><em></em><i></i><b></b></div>`);
     //显示上传的图片的小图
     let fr = new FileReader();
     if (files[i].type.indexOf("image") == 0) {
       //读取的读片是什么
       fr.readAsDataURL(files[i]);
     }
     //实例化一个图片
     let image = new Image();
     //读取之后做什么
     fr.onload = function (e) {
       //本地图片的url
       image.src = e.currentTarget.result;
       //设置背景图片
       $div.css("background-image", `url(${image.src})`);
       //上树
       $(self.refs.imgbox).append($div);
     };
     // base64地址图片加载完毕后
     image.onload = function () {
       // 图片原始尺寸
       let originWidth = this.width;
       let originHeight = this.height;
       // 最大尺寸限制
       let maxWidth = 800, maxHeight = 600;
       // 目标尺寸
       let targetWidth = originWidth, targetHeight = originHeight;
       // 图片尺寸超过800x600的限制
       if (originWidth > maxWidth || originHeight > maxHeight) {
         if (originWidth / originHeight > maxWidth / maxHeight) {
           // 更宽，按照宽度限定尺寸
           targetWidth = maxWidth;
           targetHeight = Math.round(maxWidth * (originHeight / originWidth));
         } else {
           targetHeight = maxHeight;
           targetWidth = Math.round(maxHeight * (originWidth / originHeight));
         }
       }

       // canvas对图片进行缩放
       canvas.width = targetWidth;
       canvas.height = targetHeight;
       // 清除画布
       context.clearRect(0, 0, targetWidth, targetHeight);
       context.fillStyle = "#fff";
       context.fillRect(0, 0, canvas.width, canvas.height);
       // 图片压缩
       context.drawImage(image, 0, 0, targetWidth, targetHeight);
       // canvas转为blob并上传
         canvas.toBlob(function (blob) {
           let fd = new FormData();
           fd.append("imagefile"+i, blob,files[i].name); 
           // 图片ajax上传
           let xhr = new XMLHttpRequest();
           // 文件上传成功
           xhr.onreadystatechange = function () {
             if (xhr.status == 200) {
               // xhr.responseText就是返回的数据
             }
           };
           xhr.upload.onprogress = function (e) {
             //上传过程中
             $div.find("i").html(parseInt(e.loaded / e.total * 100) + "%");
             $div.find("em").css("height",100-parseInt(e.loaded / e.total * 100));
           }
           xhr.onload = function () {
             //回调函数，pathname是后端给我们的上传的随机的文件名
             //去掉自己的em和i
             $div.find("em").remove();
             $div.find("i").remove();
             //写data-
             $div.attr("data-pathname", xhr.responseText);
           };
           // 开始上传
           xhr.open("POST", '/uploadimages', true);
           xhr.send(fd);
         }, files[i].type || 'image/jpeg');
       };
    }
  }

  //组件上树之后
  componentDidMount() {
    let otherviews = this.props.houseinfo.otherviews;
    console.log("otherviews");
    console.log(otherviews);
    
    if(otherviews && otherviews.length){
      let {nowid} = this.props;
      console.log("加载otherviews文件夹下的图片");
      for (let i = 0,length=otherviews.length; i<length; i++) {
        //这是给这个被遍历小图做的盒子
        let $div = $(`<div class="preDiv"><i></i><b></b></div>`);
        let filename = otherviews[i];
        $div.attr("data-pathname" , filename);
        //实例化一个图片
        let image = new Image();
        //本地图片的url
        image.src = `images/room_images_small/${nowid}/otherviews/${filename}`;
        //设置背景图片
        $div.css("background-image", `url(${image.src})`);
        //上树
        $(this.refs.imgbox).append($div);
      }
    }
   
    let self = this;
    //允许小图片移动
    $(this.refs.imgbox).sortable();
    //关闭按钮b的事件监听
    $(this.refs.imgbox).delegate("b", "click", function () {
      //删除自己的父元素
      $(this).parents(".preDiv").remove();
    });
    
    //监听filectrl的onchange事件，表示用户选好图片了
    $(this.refs.filectrl).bind("change", function (e) {
      let files = $(this)[0].files;
      self._createFileReaderAndUpload(files);
    });
    
    //拖拽的一套事情
    $(this.refs.imgbox).bind("dragover", function (e) {
      e.preventDefault();
      $(this).addClass("cur");
    });
    
    $(this.refs.imgbox).bind("dragleave", function (e) {
      e.preventDefault();
      $(this).removeClass("cur");
    });
    
    $(this.refs.imgbox).bind("drop", function (e) {
      e.preventDefault();
      let files = e.originalEvent.dataTransfer.files;
      $(this).removeClass("cur");
      
      self._createFileReaderAndUpload(files);
    });
  }
  componentWillUnmount(){
    $(this.refs.imgbox).off("click");
    $(this.refs.imgbox).unbind();
    $(this.refs.filectrl).unbind();
  }
  // componentWillReceiveProps(nextprops){
  //   let otherviews = nextprops.houseinfo.otherviews;
  //   if(otherviews && !this.props.houseinfo.otherviews){
  //     let {nowid} = this.props;
  //     console.log(otherviews.length)
  //     for (let i = 0,length=otherviews.length; i<length; i++) {
  //       //这是给这个被遍历小图做的盒子
  //       let $div = $(`<div class="preDiv"><i></i><b></b></div>`);
  //       let filename = otherviews[i];
  //       $div.attr("data-pathname" , filename);
  //       //实例化一个图片
  //       let image = new Image();
  //       //本地图片的url
  //       image.src = `images/room_images_small/${nowid}/otherviews/${filename}`;
  //       //设置背景图片
  //       $div.css("background-image", `url(${image.src})`);
  //       //上树
  //       $(this.refs.imgbox).append($div);
  //     }
  //   }
  // }

  render() {
    console.log("others");
    return <div>
      <div className="hd">
        <Row>
          <Col span={4}>
            <h3 className={"step2_title"}>请添加其他区域的图片</h3>
          </Col>
          <Col span={3}>
          <Button type="ghost" onClick={() => {
            $(this.refs.filectrl).trigger("click");
          }}>
            <Icon type="upload" /> 点击上传
          </Button>
          </Col>
          <Col span={2}>
          <Button type="ghost" onClick={() => {
            $(this.refs.imgbox).empty();
          }}>
            <Icon type="cross-circle" />清空
          </Button>
          <input ref="filectrl" type="file" hidden multiple/>
        </Col>
        </Row>
      </div>
      <div ref="imgbox" className="imgbox" data-album={this.props.album}></div>
    </div>;
  }
}

export default connect(
  ({updatehouse}) => ({
    nowid : updatehouse.nowid,
    houseinfo: updatehouse.houseinfo
  })
)(Step2_others);