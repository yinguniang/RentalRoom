import React from 'react';
import {connect} from "dva";
import {Checkbox} from "antd";
const CheckboxGroup = Checkbox.Group;

class CommonCondition extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
        let {propsname,filters,dispatch} = this.props;
		return (
			<div>
				<CheckboxGroup 
					options={
						this.props.options.map(item=>{
							return { label: item, value: item }
						})
					}
					onChange={(value)=>{
						dispatch({"type":"searchhouse/changeFilter" , propsname , value});
					}}
					value={filters[propsname]}
				/>
			</div>
		);
	}
}

export default connect(
	({searchhouse}) => ({
		filters : searchhouse.filters
	})
)(CommonCondition);