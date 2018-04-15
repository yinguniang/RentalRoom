import React from "react";
import { Card, Col, Row, Button, Modal, Progress, Input} from "antd";

export default class Step3_bar extends React.Component{
    constructor(){
        super();
    }

    render(){
        let {filename,realpath,progress,changedfilename} = this.props.item;
        let {_changefilename} = this.props;
        //正则表达式得到文件的类型
        const extname = filename.match(/\.(.+)$/g)[0];
        let smallpic = "/images/doc.jpg";
        //决定类型的小图
        if (extname.toLowerCase() == ".doc" || extname.toLowerCase() == ".docx"){
            smallpic = "/images/doc.jpg";
        } else if (extname.toLowerCase() == ".png" || extname.toLowerCase() == ".jpg") {
            smallpic = "/images/jpg.jpg";
        } else if (extname.toLowerCase() == ".rar" || extname.toLowerCase() == ".zip") {
            smallpic = "/images/zip.jpg";
        }

        return <Row>
            <Col span="4"> 
                <img src={smallpic} className="sicon"/>
            </Col>
            <Col span="20" style={{"paddingTop" : "10px"}}> 
                <div>
                    <Input 
                        value={changedfilename}
                        onChange={(e)=>{_changefilename(realpath , e.target.value);}}
                    ></Input>
                </div>
            </Col>
        </Row>;
    }
}