import React from 'react';
import { DatePicker , Button , Row , Col} from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import moment from "moment";
import {connect} from "dva";

class Updatedate extends React.Component { 
	constructor(props) {
		super(props);
	}

	render() {
		const updatedate = this.props.filters.updatedate;
		let {dispatch} = this.props;
		return (
			<div>
				<Row>
					<Col span="9">
						<RangePicker 
							allowClear={false}
							value={[moment(updatedate[0]) , moment(updatedate[1])]}
							onChange={(value)=>{
								dispatch({
									"type": "searchhouse/changeFilter" , 
									"propsname" : "updatedate", 
									"value" : [value[0].unix() * 1000 , value[1].unix() * 1000]
								});
							}} 
						/>
					</Col>
					<Col span="1"></Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({
								"type":"searchhouse/changeFilter" , 
								"propsname" : "updatedate" , 
								"value" : [Date.parse(new Date()) - 30 * 86400 * 1000,Date.parse(new Date())]
							})
						}}>
							近1个月
						</Button>
					</Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({
								"type":"searchhouse/changeFilter" , 
								"propsname" : "updatedate" , 
								"value" : [Date.parse(new Date()) - 2 * 30 * 86400 * 1000,Date.parse(new Date())]
							})
						}}>
							近2个月
						</Button>
					</Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({
								"type":"searchhouse/changeFilter" , 
								"propsname" : "updatedate" , 
								"value" : [Date.parse(new Date()) - 6 * 30 * 86400 * 1000,Date.parse(new Date())]
							})
						}}>
							近6个月
						</Button>
					</Col>
				</Row>
			</div>
		);
	}
}

export default connect(({searchhouse})=>({
	filters : searchhouse.filters
}))(Updatedate);