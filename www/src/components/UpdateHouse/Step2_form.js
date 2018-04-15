import React from "react";
import {Row,Col,Form,Input,Button} from "antd";
import {connect} from "dva";
import Step2_upunit from "./Step2_upunit.js";
import Step2_others from "./Step2_others.js";
const FormItem = Form.Item;

class Step2_form extends React.Component {
  constructor() {
    super();
  }
  handleClick(e){
    e.preventDefault();
    this.props.form.validateFields((errors, values) => {
      if (!!errors) {
        console.log('Errors in form!!!');
        console.log(errors);
        return;
      }
      let $imagebox = $(".imgbox");
      for(let m=0,length1=$imagebox.length;m<length1;m++){
        if($imagebox[m].children[0] && $imagebox[m].children[0].nodeName.toLowerCase() != "div"){
          console.log('empty in imgbox!!!');
          return ;
        }
      }
      console.log('step2Submit!!!');
      let roomArr = [];
      for(let i=0,length2=Object.keys(values).length/4;i<length2;i++){
        let roomObj = {};
        let k_ischecked = "room" + (i+1) + "_ischecked";
        let k_position = "room" + (i+1) + "_position";
        let k_price = "room" + (i+1) + "_price";
        let k_room_area = "room" + (i+1) + "_room_area";
        roomObj.room_name = "卧室" + (i+1);
        roomObj.ischecked = values[k_ischecked] ? true : false;
        roomObj.position = values[k_position];
        roomObj.price = Number(values[k_price]);
        roomObj.room_area = Number(values[k_room_area]);
        roomObj.path = "room" + (i+1);
        roomObj.images = [];
        let $divs = $imagebox.eq(i).children("div");
        for(let j=0,length3=$divs.length;j<length3;j++){
          roomObj.images.push($divs.eq(j).data("pathname"));
        }
        roomArr[i] = roomObj;
      }
      // console.log(roomArr);
      this.props.dispatch({
        "type": "updatehouse/changeRooms",
        roomArr
      });
      let otherviewsArr = [];
      let $others = $imagebox.last().children("div");
      console.log($others);
      for(let n=0,length4=$others.length;n<length4;n++){
        otherviewsArr.push($others.eq(n).data("pathname"));
      }
      this.props.dispatch({
        "type": "updatehouse/changeOtherviews",
        otherviewsArr
      });
      this.props.dispatch({
        "type": "updatehouse/changeStepCurrent",
        "stepCurrent" : 3
      });
    });
  }
  render() {
    let {step1} = this.props;
    const {getFieldDecorator} = this.props.form;
    let rooms = Array(step1.roomAmount).fill(step1.roomAmount);
    return ( <div className="hd">
        <Form layout="inline" >
          {rooms.map((item,index)=> <Step2_upunit index={index} key={index} form={this.props.form}/> )}
          <Step2_others album={"otherviews"}/>
          <FormItem wrapperCol={{ span: 12, offset: 7 }} style={{ marginTop: 10 }}>
                <Button type="primary" onClick={(e)=>this.handleClick(e)}>下一步</Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

export default connect(
  ({updatehouse}) => ({
    step1: updatehouse.step1
  })
)(Step2_form);