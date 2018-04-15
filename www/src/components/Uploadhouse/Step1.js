import React from "react";
import {Form} from "antd";
import Step1_form from "./Step1_form.js";
import {connect} from "dva";

class Step1 extends React.Component {
  constructor() {
    super();
    
    this.state = {
      areaOptions: [],
      subwayOptions:[]
    };
  }
  
  componentDidMount() {
    //请求所有的品牌和车系
    this.loadAreas((areas) => {
      var areaOptions = [];
      //进行形式转换
      for (var k in areas) {
        areaOptions.push({
          value: k,
          label: k,
          children: areas[k].map(item => ({
            value: item,
            label: item
          }))
        });
      }
      this.setState({
        areaOptions
      });
    });
    
    this.loadSubway((subway) => {
      var subwayOptions = [];
      for (var k in subway) {
        subwayOptions.push({
          value: k,
          label: k,
          children: subway[k].map(item => ({
            value: item,
            label: item
          }))
        });
      }
      this.setState({
        subwayOptions
      });
    });
  }
  
  //请求所有的品牌和车系
  async loadAreas(fun) {
    const areas = await fetch("/areas").then(data => data.json());
    fun(areas);
  }
  
  async loadSubway(fun) {
    const {subway} = await fetch("/subway").then(data => data.json());
    fun(subway);
  }
  
  render() {
    //创建表格的包装组件
    const WrappedRegistrationForm = Form.create({
      onFieldsChange: (props, fields) => {
        console.log(fields);
        this.props.dispatch({
          "type": "uploadhouse/changeStep1",
          "propname": Object.keys(fields)[0],
          "value": Object.values(fields)[0]
        });
      }
    })(Step1_form);
    
    return <div>
      <h1>
        <WrappedRegistrationForm
          areaOptions={this.state.areaOptions}
          subwayOptions={this.state.subwayOptions}
        ></WrappedRegistrationForm>
      </h1>
    </div>;
  }
}


export default connect()(Step1);