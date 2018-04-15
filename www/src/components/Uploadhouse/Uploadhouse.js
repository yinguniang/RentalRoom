import React from "react";
import {Steps, Button, message, Row, Col} from "antd";
import {Layout, Menu, Breadcrumb, Icon} from "antd";
import {push} from "react-router-redux";

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const Step = Steps.Step;
import {connect} from "dva";
import App from "../../containers/App.js";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

import "./Uploadhouse.less";

class Uploadhouse extends React.Component {
  constructor() {
    super();
    this.state = {
      current: 1,     //真实情况1、2、3
    };
  }
  
  changeCurrent(n) {
    this.setState({
      current: n
    });
  }
  componentWillUnmount() {
    $(this.refs.filectrl).unbind("change");
    this.timer && clearTimeout(this.timer);
  }
  render() {
    // console.log(this.props.step1);
    //步骤条的文字配置
    const steps = [
      {
        title: "房屋基本信息",
        content: <Step1/>
      },
      {
        title: "房间详细信息",
        content: <Step2 changeCurrent={this.changeCurrent.bind(this)}/>
      },
      {
        title: "其他信息",
        content: <Step3/>
      }
    ];
    
    //验证第一步的按钮是否可用
    const checkStep1Disabled = () => {
      var step1 = this.props.step1;
      var noerror = true;
      for (var k in step1) {
        if (k != "updatedate") {
          if (step1[k].errors != undefined) {
            noerror = false;
          }
        }
      }
      return !noerror;
    };
    
    const showButton = () => {
      if (this.state.current == 1) {
        return <Button
          type="primary"
          disabled={checkStep1Disabled()}
          onClick={() => {
            this.setState({"current": 2});
            this.props.dispatch({
              "type": "uploadhouse/changeStep1",
              "propname": "updatedate",
              "value": Date.parse(new Date())
            });
          }}
        >
          下一步
        </Button>;
      } else if (this.state.current == 3) {
        return <Button
          type="primary"
          onClick={() => {
            let self = this;
            let count = null;
            $(".filebox").find("img.ssicon").each(function () {
              count++;
            });
            if (!count) {
              alert("请上传必备资料文件！");
              return;
            }
            this.props.dispatch({"type": "uploadhouse/addhouse"});
            alert("提交成功，正在为您跳转到房源展示页面....");
            this.timer = setTimeout(function () {
              console.log("setTimeout");
              self.props.dispatch(push("/searchhouse"));
            }, 20);
          }}
        >
          提交
        </Button>;
      }
    };

    return (
      <App>
        {/* this.state.current这里是从0开始算的 */}
        <Steps current={this.state.current - 1}>
          {steps.map(item => <Step key={item.title} title={item.title}/>)}
        </Steps>
        <div className="content_box">
          {steps[this.state.current - 1].content}
        </div>
        <div className="btn_box">
          {
            showButton()
          }
        </div>
      </App>
    );
  }
}


export default connect(
  ({uploadhouse}) => ({
    step1: uploadhouse.step1
  })
)(Uploadhouse);