import React from "react";
import {Steps, Button, message, Row, Col} from "antd";
import {Layout, Menu, Breadcrumb, Icon} from "antd";

const {SubMenu} = Menu;
const {Header, Content, Sider} = Layout;
const Step = Steps.Step;
import {connect} from "dva";
import App from "../../containers/App.js";
import Step1 from "./Step1.js";
import Step2 from "./Step2.js";
import Step3 from "./Step3.js";
import "./UpdateHouse.less";

class UpdateHouse extends React.Component {
  constructor(props) {
    super(props);
    props.dispatch({"type":"updatehouse/changeStepCurrent" , "stepCurrent" : 1});
  }
  componentDidMount(){
    //构造函数中发出请求，请求服务器的默认数据
	  this.props.dispatch({"type":"updatehouse/init" , "nowid" : this.props.match.params.id});
  }
  render() {
    let {stepCurrent} = this.props;
    //步骤条的文字配置
    const steps = [
      {
        title: "房屋基本信息",
        content: <Step1></Step1>
      },
      {
        title: "房间详细信息",
        content: <Step2></Step2>
      },
      {
        title: "其他信息",
        content: <Step3></Step3>
      }
    ];
    return (
      <App>
        {/* current这里是从0开始算的 */}
        <Steps current={stepCurrent - 1}>
          {steps.map(item => <Step key={item.title} title={item.title}/>)}
        </Steps>
        <div className="content_box">
            {steps[stepCurrent - 1].content}
        </div>
      </App>
    );
  }
}

export default connect(
  ({updatehouse,routing}) => ({
    stepCurrent : updatehouse.stepCurrent,
    location : routing.location
  })
)(UpdateHouse);