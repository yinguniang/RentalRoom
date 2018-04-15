import React from "react";
import {Form} from "antd";
import {connect} from "dva";
import Step2_form from "./Step2_form.js";

class Step2 extends React.Component {
  constructor() {
    super();
  }
  
  render() {
    let {step1} = this.props;
    //创建表格的包装组件
    const WrappedRegistrationForm = Form.create()(Step2_form);
    return ( <div>
        <input type="file" ref="myfilectrl" hidden multiple/>
        <WrappedRegistrationForm />
      </div>
    );
  }
}

export default connect()(Step2);