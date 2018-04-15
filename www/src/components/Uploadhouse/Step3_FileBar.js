import React from "react";
import { Card, Col, Row, Button, Modal, Progress, Input, Menu, Dropdown} from 'antd';

export default class Step3_FileBar extends React.Component{
    constructor(){
        super();
    }

    render(){
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

        return <div className="rrrrow">
            <Row>
                <Col span={4}>
                   <div className="frow">
                        <img src={xiaotu} className="ssicon" />
                        <span>
                            {this.props.item.changedfilename}
                        </span>
                   </div>
                </Col>
                <Col span={10}>
                    <div className="tools">
                        <a href="javascript:;" onClick={() => { 
                            this.props.changeisShowcmm(true , this.props.item.filename)
                        }}>重命名</a>
                        <a href="javascript:;">删除</a>
                    </div>
                </Col>
            </Row>
        </div>
    }
}