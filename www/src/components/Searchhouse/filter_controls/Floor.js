import React from 'react';
import {Slider , Row , Col , Button} from "antd";
import {connect} from "dva";

class Floor extends React.Component {	 
	constructor(props) {
		super(props);
		//“过继”一下全局price-内部state
		this.state = {
			floor : props.filters.floor
		}
	}

	//当全局数据要改变的时候
	componentWillReceiveProps(props){
		//重新“过继”一下全局price-内部state
		this.setState({floor : props.filters.floor})
	}
	render() {
        let {filters,dispatch} = this.props;
		return (
			<div>
				<Row>
				<Col span="9" >
						<Slider 
							range
							min={1} 
							max={12}
							defaultValue={this.state.floor}
							value={this.state.floor}
							onChange={(value)=>{
								this.setState({"floor" : value})
							}}
							onAfterChange={(value)=>{
								dispatch({"type":"searchhouse/changeFilter" , "propsname" : "floor" , value})
							}}
						></Slider>
					</Col>
					<Col span="1"></Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({"type":"searchhouse/changeFilter" , "propsname" : "floor" , "value" : [1,3]})
						}}>
							1-3楼
						</Button>
					</Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({"type":"searchhouse/changeFilter" , "propsname" : "floor" , "value" : [3,6]})
						}}>
							3-6楼
						</Button>
					</Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({"type":"searchhouse/changeFilter" , "propsname" : "floor" , "value" : [6,10]})
						}}>
							6-10楼
						</Button>
					</Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({"type":"searchhouse/changeFilter" , "propsname" : "floor" , "value" : [10,12]})
						}}>
							10楼以上
						</Button>
					</Col>
				</Row>
			</div>
		);
	}
}

export default connect(({searchhouse})=>({
	filters : searchhouse.filters
}))(Floor);