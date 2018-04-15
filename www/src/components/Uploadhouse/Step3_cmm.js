import React from "react";
import {Card, Col, Row, Button, Modal, Progress, Input} from 'antd';
import {connect} from "dva";

class Step3_cmm extends React.Component {
  constructor() {
    super();
  }
  
  
  render() {
    //决定图片的类型
    const filename = this.props.item.filename;
    //正则表达式得到文件的类型
    const extname = filename.match(/\.(.+)$/g)[0];
    
    //决定类型的小图
    if (extname.toLowerCase() == ".doc" || extname.toLowerCase() == ".docx") {
      var xiaotu = "/images/doc.jpg";
    } else if (extname.toLowerCase() == ".png" || extname.toLowerCase() == ".jpg") {
      var xiaotu = "/images/jpg.jpg";
    } else if (extname.toLowerCase() == ".rar" || extname.toLowerCase() == ".zip") {
      var xiaotu = "/images/zip.jpg";
    }
    
    return <div>
      <Col span="6">
        <img src={xiaotu} className="sicon"/>
      </Col>
      <Col span="20" style={{"paddingTop": "10px"}}>
        <div>
          <Input
            value={this.props.item.changedfilename}
            onChange={(e) => {
              this.props.dispatch({
                "type": "uploadhouse/changeStep3OneFileName",
                "filename": filename,
                "changedfilename": e.target.value
              });
            }}
          ></Input>
        </div>
      </Col>
    </div>;
  }
}

export default connect()(Step3_cmm);