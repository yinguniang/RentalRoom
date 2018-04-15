import React from "react";
import {Card, Col, Row, Button, Modal, Progress,Icon} from 'antd';
import uploadfiles from "./utils/uploadfiles.js";
import {connect} from "dva";

import Step3_bar from "./Step3_bar.js";
import Step3_FileBar from "./Step3_FileBar.js";
import Step3_cmm from "./Step3_cmm.js";

class Step3 extends React.Component {
  constructor() {
    super();
    
    this.state = {
      isShowModal: false,
      isShowcmm: false,
      nowUpfiles: [],
      nowcmmfilename: ""
    };
  }
  
  //显示重命名
  changeisShowcmm(isShowcmm, nowcmmfilename) {
    this.setState({
      isShowcmm
    });
    
    this.setState({
      nowcmmfilename
    });
  }
  
  //改名
  changefilename(filename, changedfilename) {
    this.setState({
      "nowUpfiles": this.state.nowUpfiles.map(item => item.filename == filename ? {...item, changedfilename} : item)
    });
  }
  
  //组件已经上树
  componentDidMount() {
    var self = this;
    //监听filectrl
    $(this.refs.filectrl).bind("change", function () {
      //文件队列
      var files = $(this)[0].files;
      //变为数组
      files = [...files];
      
      var arr = files.map(item => ({
        "filename": item.name,
        "changedfilename": item.name,
        "progress": 0
      }));
      
      self.setState({nowUpfiles: arr});
      
      //执行上传
      for (let i = 0; i<files.length; i++) {
        let filename = files[i].name;
        
        uploadfiles(
          files[i],
          function (realpath) {
            //完成
            //改变state，添加一个realpath
            self.setState({
              "nowUpfiles": self.state.nowUpfiles.map(item => {
                if (item.filename == filename) {
                  return {
                    ...item,
                    realpath
                  };
                }
                return item;
              })
            });
          },
          function (e) {
            //进度
            var progress = parseInt(e.loaded / e.total * 100);
            //设置state
            self.setState({
              "nowUpfiles": self.state.nowUpfiles.map(item => {
                if (item.filename == filename) {
                  return {
                    ...item,
                    progress
                  };
                }
                return item;
              })
            });
          },
          "/uploadziliao"
        );
      }
      //弹出模态框
      self.setState({isShowModal: true});
    });
  }
  
  render() {
    return <div>
      <div className="hd">
        <h3>房子必备资料文件</h3>
        <Button type="ghost" onClick={() => {
          $(this.refs.filectrl).trigger("click");
        }}>
          <Icon type="upload" /> 点击上传
        </Button>
        <input type="file" hidden multiple ref="filectrl"/>
      </div>
      
      {/* 罗列已经上传的文件 */}
      <div className="filebox">
        {
          this.state.nowUpfiles.map((item, index) => {
            return <Step3_FileBar
              key={index}
              item={item}
              changeisShowcmm={this.changeisShowcmm.bind(this)}
            ></Step3_FileBar>;
          })
        }
      </div>
      
      <Modal
        title="上传"
        visible={this.state.isShowModal}
        onOk={() => {
          //发出dispatch
          this.props.dispatch({"type": "uploadhouse/changeStep3", "arr": this.state.nowUpfiles});
          this.setState({
            isShowModal: false
          });
        }}
        onCancel={() => {
          this.setState({
            isShowModal: false
          });
        }}
        width={600}
        destroyOnClose={true}
      >
        {
          this.state.nowUpfiles.map((item, index) => {
            return <Step3_bar
              key={index}
              item={item}
              changefilename={this.changefilename.bind(this)}
            ></Step3_bar>;
          })
        }
      </Modal>
      
      <Modal
        title="重命名"
        visible={this.state.isShowcmm}
        onOk={() => {
          this.setState({
            isShowcmm: true
          });
        }}
        onCancel={() => {
          this.setState({
            isShowcmm: false
          });
        }}
        width={600}
        destroyOnClose={true}
      >
        <Step3_cmm
          changefilename={this.changefilename.bind(this)}
          item={this.props.files.filter(item => item.filename == this.state.nowcmmfilename)[0]}
        ></Step3_cmm>
      </Modal>
    </div>;
  }
}

export default connect(
  ({uploadhouse}) => ({
    files: uploadhouse.step3.files
  })
)(Step3);