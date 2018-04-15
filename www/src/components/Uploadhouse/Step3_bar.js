import React from "react";
import { Card, Col, Row, Button, Modal, Progress, Input} from "antd";

export default class Step3_bar extends React.Component{
    constructor(){
        super();
    }

    render(){
        //决定图片的类型
        const filename = this.props.item.filename;
        //正则表达式得到文件的类型
        const extname = filename.match(/\.(.+)$/g)[0];

        //决定类型的小图
        if (extname.toLowerCase() == ".doc" || extname.toLowerCase() == ".docx"){
            var xiaotu = "/images/doc.jpg";
        } else if (extname.toLowerCase() == ".png" || extname.toLowerCase() == ".jpg") {
            var xiaotu = "/images/jpg.jpg";
        } else if (extname.toLowerCase() == ".rar" || extname.toLowerCase() == ".zip") {
            var xiaotu = "/images/zip.jpg";
        }

        return <Row>
            <Col span="4"> 
                <img src={xiaotu} className="sicon"/>
            </Col>
            <Col span="20" style={{"paddingTop" : "10px"}}> 
                {
                    this.props.item.progress != 100
                    ?
                    <div>
                        {filename}
                        <Progress percent={this.props.item.progress} status="active" />
                    </div>
                    :
                    <div>
                        <Input 
                            value={this.props.item.changedfilename}
                            onChange={(e)=>{
                                this.props.changefilename(filename , e.target.value);
                            }}
                        ></Input>
                    </div>
                }
                    
            </Col>
        </Row>;
    }
}