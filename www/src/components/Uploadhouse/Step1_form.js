import React from "react";
import {
  Radio,
  Form,
  Input,
  Tooltip,
  Icon,
  Cascader,
  DatePicker,
  Select,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Canlenda,
  InputNumber
} from "antd";

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const RadioGroup = Radio.Group;

export default class Step1_form extends React.Component {
  constructor() {
    super();
  }
  
  
  render() {
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
    const narrow = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 3}        //题目
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 6}       //填写部分
      }
    };
    
    const inlineLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 24},        //题目
        md: {span: 24},
        lg: {span: 14},
        xl: {span: 18}
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 24},       //填写部分
        md: {span: 24},
        lg: {span: 4},
        xl: {span: 6}
      }
    };
    
    const {getFieldDecorator} = this.props.form;
    
    return <div>
      <Form>
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
                        callback("请填写0~20之内的字数");
                        return;
                      }
                      callback();
                    }
                  },
                  {"required": true, "message": "必填"}
                ]
              }
            )(
              <Input/>
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
                        callback("请填写0~12之内的字数");
                        return;
                      }
                      callback();
                    }
                  },
                  {"required": true, "message": "必填"}
                ]
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
                ]
              }
            )(
              <Cascader options={this.props.areaOptions}/>
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
                  {"required": true, "message": "必填"}
                ]
              }
            )(
              <Cascader options={this.props.subwayOptions}/>
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
                ]
              }
            )(
              <Select>
                {
                  [1, 2, 3, 4, 5].map(item => {
                    return <Option value={item} key={item}>{item}</Option>;
                  })
                }
              </Select>
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
                ]
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
                ]
              }
            )(
              <Input/>
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="整体朝向"
        >
          {
            getFieldDecorator(
              "orientation",
              {
                rules: [
                  {"required": true, "message": "必填"}
                ]
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
                ]
              }
            )(
              <RadioGroup>
                <Radio value="集体供暖东">集体供暖</Radio>
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
                ]
              }
            )(
              <Input/>
            )
          }
        </FormItem>
      </Form>
        <FormItem
          {...narrow}
          label="是否临近地铁"
        >
          {
            getFieldDecorator(
              "nearsubway",
              {
                rules: [
                  {"required": true, "message": "必填"}
                ]
              }
            )(
              <Select style={{width: 180}}>
                <Option value={1}>临近地铁</Option>
                <Option value={0}>不临近地铁</Option>
              </Select>
            )
          }
        </FormItem>
        <FormItem
          {...narrow}
          label="是否有智能锁"
        >
          {
            getFieldDecorator(
              "intelligentlock",
              {
                rules: [
                  {"required": true, "message": "必填"}
                ]
              }
            )(
              <Select style={{width: 180}}>
                <Option value={1}>有智能锁</Option>
                <Option value={0}>没有智能锁</Option>
              </Select>
            )
          }
        </FormItem>
    </div>;
  }
}