import React from "react";
import { Card, Col, Row, Button, Modal, Progress, Input, Menu, Dropdown} from 'antd';

export default class Step3_FileBar extends React.Component{
    constructor(){
        super();
    }
    render(){
        let {filename,realpath,changedfilename} = this.props.item;
        let {_changeisShowcmm,_removeFile} = this.props;
        //正则表达式得到文件的类型
        const extname = filename.match(/\.(.+)$/g)[0];
        let smallpic = "/images/doc.jpg";
        //决定类型的小图
        if (extname.toLowerCase() == ".doc" || extname.toLowerCase() == ".docx") {
            smallpic = "/images/doc.jpg";
        } else if (extname.toLowerCase() == ".png" || extname.toLowerCase() == ".jpg") {
            smallpic = "/images/jpg.jpg";
        } else if (extname.toLowerCase() == ".rar" || extname.toLowerCase() == ".zip") {
            smallpic = "/images/zip.jpg";
        }

        return <div className="rrrrow" ref={(div) => this.div = div}>
            <Row>
                <Col span={4}>
                   <div className="frow">
                        <img src={smallpic} className="ssicon" />
                        <span>{changedfilename}</span>
                   </div>
                </Col>
                <Col span={10}>
                    <div className="tools">
                        <a href="javascript:;" onClick={()=>{ _changeisShowcmm(true , realpath)}}>重命名</a>
                        <a href="javascript:;" onClick={()=>{_removeFile(realpath)}}>删除</a>
                    </div>
                </Col>
            </Row>
        </div>
    }
}