import React from "react";
import {Card, Col, Row, Button,Icon, Modal, Progress} from 'antd';
import uploadfiles from "./utils/uploadfiles.js";
import {connect} from "dva";
import {push} from "react-router-redux";
import Step3_bar from "./Step3_bar.js";
import Step3_FileBar from "./Step3_FileBar.js";
import Step3_cmm from "./Step3_cmm.js";
import { clearTimeout } from "timers";

class Step3 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowModal: false,
      isShowcmm: false,
      nowUpfiles: props.files,
      nowcmmrealpath: ""
    };
    this._changeisShowcmm = this._changeisShowcmm.bind(this);
    this._changefilename = this._changefilename.bind(this);
    this._removeFile = this._removeFile.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(){
    let self = this;    
    let $uploadfiles = $(".filebox div");
    if(!$uploadfiles.length && !self.state.nowUpfiles.length){
      alert("请添加房子必备资料文件");
      return;
    }
    console.log("step3submit");
    //发出dispatch
    self.props.dispatch({"type": "updatehouse/changeFiles", "files": self.state.nowUpfiles});
    self.props.dispatch({"type": "updatehouse/update"});
    alert("提交成功，正在为您跳转到房源展示页面....");    
    self.timer = setTimeout(function(){
        console.log("setTimeout");
        self.props.dispatch(push("/details/" + self.props.nowid));
        // self.props.dispatch({"type": "updatehouse/changeStepCurrent" , "stepCurrent" : 1});
    },20);
  }
  //显示重命名
  _changeisShowcmm(isShowcmm, nowcmmrealpath) {
    this.setState({isShowcmm,nowcmmrealpath});
  }
  
  //改名
  _changefilename(realpath, changedfilename) {
    this.setState({
      "nowUpfiles": this.state.nowUpfiles.map(item => item.realpath == realpath ? {...item, changedfilename} : item)
    });
  }
  //删除某一个文件
  _removeFile(realpath){
    this.setState({
      "nowUpfiles": this.state.nowUpfiles.filter(item => item.realpath != realpath )
    });
    this.tempArr = this.state.nowUpfiles.filter(item => item.realpath != realpath )
  }
  //组件已经上树
  componentDidMount() {
    let self = this;
    self.tempArr = [];
    //监听filectrl
    $(this.refs.filectrl).bind("change", function () {
      //文件队列
      let files = $(this)[0].files;
      if(!files.length) return; 
      //变为数组
      files = [...files];   
      
      //执行上传
      for (let i = 0,length=files.length; i<length; i++) {
        let filename = files[i].name;
        uploadfiles(
          files[i],
          function (realpath) {
            //完成,改变state，添加一个realpath
            let tempObj = {};
            tempObj.filename = filename;
            tempObj.changedfilename = filename;
            tempObj.realpath = realpath;
            self.tempArr.push(tempObj);
            console.log(self.tempArr)
            self.setState({nowUpfiles: self.tempArr});
            //改变state，添加一个realpath
          },
          function (e) {
            //进度
            let progress = parseInt(e.loaded / e.total * 100);
          },
          "/uploadziliao"
        );
      }
      //弹出模态框
      self.setState({isShowModal: true});
    });
  }
  componentWillUnmount() {
    $(this.refs.filectrl).unbind("change");
  }
  
  render() {
    let {files,dispatch} = this.props;
    let {isShowModal,isShowcmm,nowUpfiles,nowcmmrealpath} = this.state;
    return <div>
      <div className="hd">
        <h3>房子必备资料文件</h3>
        <Button type="ghost" onClick={() => {
              $(this.refs.filectrl).trigger("click");
            }}>
              <Icon type="upload" /> 点击上传
        </Button>
        <Button type="ghost" onClick={() => {
              $(".filebox").empty();
              this.setState({nowcmmrealpath : []});
            }}>
              <Icon type="cross-circle" /> 清空
        </Button>
        <input type="file" hidden multiple ref="filectrl"/>
      </div>
      
      {/* 罗列已经上传的文件 */}
      <div className="filebox">
        {
          nowUpfiles.length >0 ? nowUpfiles.map((item, index) => {
            return <Step3_FileBar
              key={index}
              item={item}
              _changeisShowcmm = {this._changeisShowcmm}
              _removeFile = {this._removeFile}
            ></Step3_FileBar>;
          }) : null
        }
      </div>
      <Button type="primary" onClick={this.handleClick}>提交</Button>
      {/* <Modal
        title="上传"
        visible={isShowModal}
        onOk={() => {this.setState({isShowModal: false})}}
        onCancel={() => {this.setState({isShowModal: false})}}
        width={600}
        destroyOnClose={true}
      >
        {
          nowUpfiles.length >0 ? nowUpfiles.map((item, index) => {
            return <Step3_bar
              key={index}
              item={item}
              _changefilename={this._changefilename}
            ></Step3_bar>;
          }) : null
        }
      </Modal> */}
      
      <Modal
        title="重命名"
        visible={isShowcmm}
        onOk={() => {this.setState({isShowcmm: false})}}
        onCancel={() => {this.setState({isShowcmm: false});
        }}
        width={600}
        destroyOnClose={true}
      >
        <Step3_cmm
          _changefilename={this._changefilename}
          item={nowUpfiles.filter(item => item.realpath == nowcmmrealpath)[0]}
        ></Step3_cmm>
      </Modal>
    </div>;
  }
}

export default connect(
  ({updatehouse}) => ({
    files: updatehouse.step3.files,
    nowid : updatehouse.nowid
  })
)(Step3);