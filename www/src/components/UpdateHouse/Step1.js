import React from "react";
import {Form} from "antd";
import Step1_form from "./Step1_form.js";
import {connect} from "dva";

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      areaOptions: [],
      subwayOptions: []
    };
  }
  
  componentDidMount() { 
    //请求房子区域信息
    this._loadAreas((areas) => {
      let areaOptions = [];
      //进行形式转换
      for (let k in areas) {
        areaOptions.push({
          value: k,
          label: k,
          children: areas[k].map(item => ({
            value: item,
            label: item
          }))
        });
      }
      this.setState({areaOptions});
    });
    
    this._loadSubway((subway) => {
      let subwayOptions = [];
      for (let k in subway) {
        subwayOptions.push({
          value: k,
          label: k,
          children: subway[k].map(item => ({
            value: item,
            label: item
          }))
        });
      }
      this.setState({subwayOptions});
    });
  }
  componentWillUnmount(){
    //重写组件的setState方法，直接返回空
    this.setState = (state,callback)=>{
      return;
    };  
  }
  //请求房子区域信息
  async _loadAreas(callback) {
    const areas = await fetch("/areas").then(response => response.json());
    callback(areas);
  }
  //请求地铁信息
  async _loadSubway(callback) {
    const {subway} = await fetch("/subway").then(response => response.json());
    callback(subway);
  }
  
  render() {
    let {houseinfo,dispatch} = this.props;
    //创建表格的包装组件
    const WrappedRegistrationForm = Form.create()(Step1_form);
    
    return <div>
      <h1>
        <WrappedRegistrationForm
          areaOptions={this.state.areaOptions}
          subwayOptions={this.state.subwayOptions}
          houseinfo = {houseinfo}
        ></WrappedRegistrationForm>
      </h1>
    </div>;
  }
}

export default connect(
  ({updatehouse}) => ({
    houseinfo : updatehouse.houseinfo
  })
)(Step1);