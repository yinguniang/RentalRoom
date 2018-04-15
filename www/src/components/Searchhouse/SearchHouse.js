import React, { Component } from 'react'
import {connect} from "dva";
import { BackTop,Icon, Input, Button ,Row,Col} from 'antd';
import App from "../../containers/App.js";
import FilterCondition from "./FilterCondition.js";
import FilterResult from "./FilterResult.js";
import classNames from 'classnames';
import "./SearchHouse.less";

const InputGroup = Input.Group;

class SearchHouse extends Component {
    constructor(props){
        super(props);
        this.state = {
            "value": '',
            "focus": false
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFocusBlur = this.handleFocusBlur.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        //调用默认数据
		props.dispatch({"type" : "searchhouse/init"});
    }

    handleInputChange(e) {
        this.setState({
          value: e.target.value
        });
    }
    handleFocusBlur(e) {
        this.setState({
          focus: e.target === document.activeElement
        });
    }
    handleSearch() {
        this.props.dispatch({ "type": "searchhouse/changeSearch", "search": this.state.value })
    }

    //当全局数据要改变的时候
	componentWillReceiveProps(nextprops){
		//重新“过继”一下全局price-内部state
		this.setState({"value" : nextprops.search})
    }
    
    render() {
        let {dispatch} = this.props;
        const btnCls = classNames({
            'ant-search-btn': true,
            'ant-search-btn-noempty': !!this.state.value.trim()
        });
        const searchCls = classNames({
            'ant-search-input': true,
            'ant-search-input-focus': this.state.focus
        });
        return (
            <App>
                <Row>
                    <Col span="3">
                        <span style={{"fontWeight" :"bold"}}>请输入查询条件：</span>
                    </Col>
                    <Col span="14">
                        <InputGroup className={searchCls} style={{ "width": 300} }>
                        <Input value={this.state.value} onChange={this.handleInputChange}
                            onFocus={this.handleFocusBlur} onBlur={this.handleSearch} 
                            placeholder="（小区名、街道、地铁）"/>
                        <div className="ant-input-group-wrap">
                            <Button className={btnCls}  onClick={this.handleSearch}>
                            <Icon type="search" />
                            </Button>
                        </div>
                        </InputGroup>
                    </Col>
                </Row>
                <FilterCondition></FilterCondition>
                <FilterResult></FilterResult>
                <div>
                    <BackTop style={{"right" : "50px" , "bottom" : "80px"}}/>
                </div>
            </App>
        )
    }
}

export default connect(
    ({searchhouse})=>({
        search : searchhouse.search  
    })
)(SearchHouse);
