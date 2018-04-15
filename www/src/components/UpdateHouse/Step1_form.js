import React from "react";
import {connect} from "dva";
import {Radio, Form,Input,Tooltip,Icon,Cascader,DatePicker,InputNumber,Select,Row,Col,Checkbox,Button,AutoComplete,Canlenda} from "antd";
import moment from "moment";
const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

class Step1_form extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
 handleClick(e){
  e.preventDefault();
  this.props.form.validateFields((errors, values) => {
    if (!!errors) {
      console.log('Errors in form!!!');
      return;
    }
    console.log('step1Submit!!!');
    this.props.dispatch({
      "type": "updatehouse/changeStep1",
      values
    });
    this.props.dispatch({
      "type": "updatehouse/changeStepCurrent",
      "stepCurrent" : 2
    });
  });
 }
  render() {
    if(!this.props.houseinfo.subway) return null;
    //定义表格的布局，xs表示极小，sm表示小屏
    const wide = {
      labelCol: {
          xs: { span: 24 },
          sm: {span: 24},        //题目
          md: {span: 2},
          lg: {span: 2},
          xl: {span: 2}    
      },
      wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },  
          md: {span: 12},
          lg: {span: 12},
          xl: {span: 12}         
      },
    };
    const updateDate = {
      labelCol: {
          xs: { span: 24 },
          sm: {span: 24},        //题目
          md: {span: 8},
          lg: {span: 8},
          xl: {span: 8}    
      },
      wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },  
          md: {span: 12},
          lg: {span: 12},
          xl: {span: 12}         
      },
    };
    const narrow = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 2}        
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 6}       
      }
    };
    const inlineLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 24},        
        md: {span: 24},
        lg: {span: 14},
        xl: {span: 15}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},       
        md: {span: 24},
        lg: {span: 4},
        xl: {span: 6}
      }
    };
    const {getFieldDecorator} = this.props.form;
    let {areaOptions,subwayOptions,houseinfo} = this.props;
    let subway = houseinfo.subway;
    let self = this;
    return <div>
      <Form onSubmit={()=>{
        console.log(1111);
        this.handleClick();
      }}>
        <FormItem
          {...narrow}
          label="联系人"
        >
          {
            getFieldDecorator(
              "owner",
              {
                rules: [
                  {
                    "validator": function (rule, value, callback) {
                      //如果不是数组，势必就是NaN，NaN不能参与比较
                      value = String(value);
                      if (!(value.length>0 && value.length<=20)) {
                        callback("请填写长度0~10以内的名字");
                        return;
                      }
                      callback();
                    }
                  },
                  {"required": true, "message": "必填"}
                ],
                initialValue : houseinfo.owner
              }
            )(
              <Input />
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="小区名称"
        >
          {
            getFieldDecorator(
              "estate",
              {
                rules: [
                  {
                    "validator": function (rule, value, callback) {
                      //如果不是数组，势必就是NaN，NaN不能参与比较
                      value = String(value);
                      if (!(value.length>0 && value.length<=12)) {
                        callback("请填写0~12以内的长度");
                        return;
                      }
                      callback();
                    }
                  },
                  {"required": true, "message": "必填"}
                ],
                initialValue : houseinfo.estate
              }
            )(
              <Input/>
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="区域"
        >
          {
            getFieldDecorator(
              "areaanddetail",
              {
                rules: [
                  {"required": true, "message": "必填"}
                ],
                initialValue : [houseinfo.area, houseinfo.areadetail]
              }
            )(
              <Cascader options={areaOptions}/>
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="地铁站"
        >
          {
            getFieldDecorator(
              "subwayandstation",
              {
                rules: [
                  {
                    "validator": function (rule, value, callback) {
                      if (value.length != 2) {
                        callback("请选择地铁线与地铁站");
                        return;
                      }
                      callback();
                    }
                  },
                  {"required": true, "message": "必填"}
                ],
                initialValue : [subway[0], houseinfo.station]
              }
            )(
              <Cascader options={subwayOptions} ref={(checkbox) => { this.checkbox = checkbox; }}/>
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="房间个数"
        >
          {
            getFieldDecorator(
              "roomAmount",
              {
                rules: [
                  {"required": true, "message": "必填"}
                ],
                initialValue : houseinfo.roomAmount
              }
            )(
              <InputNumber min={1} max={5} style={{ width: 100 }} />
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="楼层"
        >
          {
            getFieldDecorator(
              "floor",
              {
                rules: [
                  {
                    "validator": function (rule, value, callback) {
                      //如果不是数组，势必就是NaN，NaN不能参与比较
                      value = Number(value);
                      if (!(parseFloat(value)>0 && parseFloat(value)<=12)) {
                        callback("请填写0~12之内的数字");
                        return;
                      }
                      callback();
                    }
                  },
                  {"required": true, "message": "必填"}
                ],
                initialValue : houseinfo.floor
              }
            )(
              <Input/>
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="面积"
        >
          {
            getFieldDecorator(
              "floorspace",
              {
                rules: [
                  {
                    "validator": function (rule, value, callback) {
                      //如果不是数组，势必就是NaN，NaN不能参与比较
                      value = Number(value);
                      if (!(parseFloat(value)>=40 && parseFloat(value)<=160)) {
                        callback("请填写40~160之内的数字");
                        return;
                      }
                      callback();
                    }
                  },
                  {"required": true, "message": "必填"}
                ],
                initialValue : houseinfo.floorspace
              }
            )(
              <Input/>
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="整体朝向："
          >
          {
            getFieldDecorator(
              "orientation",
              {
                rules: [
                  {"required": true, "message": "必填"}
                ],
                initialValue : houseinfo.orientation
              }
            )(
              <RadioGroup>
                <Radio value="东">东</Radio>
                <Radio value="西">西</Radio>
                <Radio value="南">南</Radio>
                <Radio value="北">北</Radio>
              </RadioGroup>
            )
          }
        </FormItem>
        <FormItem
          {...wide}
          label="供暖方式"
          >
          {
            getFieldDecorator(
              "heating",
              {
                rules: [
                  {"required": true, "message": "必填"}
                ],
                initialValue : houseinfo.heating
              }
            )(
              <RadioGroup>
                <Radio value="集体供暖">集体供暖</Radio>
                <Radio value="独立供暖">独立供暖</Radio>
                <Radio value="中央供暖">中央供暖</Radio>
              </RadioGroup>
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="售价（元）"
        >
          {
            getFieldDecorator(
              "price",
              {
                rules: [
                  {
                    "validator": function (rule, value, callback) {
                      //如果不是数组，势必就是NaN，NaN不能参与比较
                      value = Number(value);
                      if (!(parseFloat(value)>=800 && parseFloat(value)<=13000)) {
                        callback("请填写800~13000之内的数字");
                        return;
                      }
                      callback();
                    }
                  },
                  {"required": true, "message": "必填"}
                ],
                initialValue : houseinfo.price
              }
            )(
              <Input/>
            )
          }
        </FormItem>
      </Form>
      <Form layout="inline">
            <FormItem
              {...inlineLayout}
              label="是否临近地铁"
            >
              {
                getFieldDecorator(
                  "nearsubway",
                  {
                    rules: [
                      {"required": true, "message": "必填"}
                    ],
                    initialValue : houseinfo.nearsubway ? "是" : "否"
                  }
                )(
                  <Select style={{ width: 60 }}>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem
              {...inlineLayout}
              label="是否有智能锁"
            >
              {
                getFieldDecorator(
                  "intelligentlock",
                  {
                    rules: [
                      {"required": true, "message": "必填"}
                    ],
                    initialValue : houseinfo.intelligentlock ? "是" : "否"
                  }
                )(
                  <Select style={{ width: 60 }}>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )
              }
            </FormItem>
            <FormItem
            {...updateDate}
              label="上传日期："
            >
                <DatePicker defaultValue={moment()} disabled />
            </FormItem>
            <FormItem  {...wide}>
              <Button type="primary" onClick={(e)=>this.handleClick(e)}>下一步</Button>
            </FormItem>
      </Form>
      
    </div>
  }
}

export default connect()(Step1_form);
