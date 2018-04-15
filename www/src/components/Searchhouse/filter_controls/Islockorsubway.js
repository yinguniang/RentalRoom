import React from 'react';
import {Menu, Dropdown , Button , Icon} from "antd";
import {connect} from "dva";

class Islockorsubway extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let {chinese,propsname,options,filters,dispatch} = this.props;
		const menu = (
			<Menu onClick={(value)=>{
				dispatch({"type":"searchhouse/changeFilter" , propsname , "value" : value.key})
			}}>
				{
					options.map(item=>{
						return <Menu.Item key={item}>{item}</Menu.Item>
					})
				}
			</Menu>
		);

		return (
			<div>
				{chinese}：
				<Dropdown overlay={menu}>
					<Button style={{ marginLeft: 8 }}>
						{filters[propsname] || "不限"} 
						<Icon type="down" />
					</Button>
				</Dropdown>
			</div>
		);
	}
}

export default connect(
	({searchhouse}) => ({
		filters : searchhouse.filters
	})
)(Islockorsubway);