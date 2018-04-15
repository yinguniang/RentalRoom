import React from 'react';
import {Slider , Row , Col , Button} from "antd";
import {connect} from "dva";

class HouseArea extends React.Component { 
	constructor(props) {
		super(props);

		//“过继”一下全局km-内部state
		this.state = {
			floorspace : props.filters.floorspace
		}
	}

	//当全局数据要改变的时候
	componentWillReceiveProps(props){
		//重新“过继”一下全局km-内部state
		this.setState({floorspace : props.filters.floorspace})
	}

	render() {
		let {dispatch} = this.props;
		return (
			<div>
				<Row>
					<Col span="9" >
						<Slider
							range
							min={40}
							max={160}
							defaultValue={this.state.floorspace}
							value={this.state.floorspace}
							onChange={(value) => {
								this.setState({ "floorspace": value })
							}}
							onAfterChange={(value) => {
								dispatch({ "type": "searchhouse/changeFilter", "propsname": "floorspace", value })
							}}
						></Slider>
					</Col>
					<Col span="1"></Col>
					<Col span="3">
						<Button onClick={() => {
							dispatch({ "type": "searchhouse/changeFilter", "propsname": "floorspace", "value": [40, 60] })
						}}>
							40-60平米
					</Button>
					</Col>
					<Col span="3">
						<Button onClick={() => {
							dispatch({ "type": "searchhouse/changeFilter", "propsname": "floorspace", "value": [60, 80] })
						}}>
							60-80平米
					</Button>
					</Col>
					<Col span="3">
						<Button onClick={() => {
							dispatch({ "type": "searchhouse/changeFilter", "propsname": "floorspace", "value": [80, 120] })
						}}>
							80-120平米
					</Button>
					</Col>
					<Col span="3">
						<Button onClick={() => {
							dispatch({ "type": "searchhouse/changeFilter", "propsname": "floorspace", "value": [120, 160] })
						}}>
							120平米以上
					</Button>
					</Col>
				</Row>
			</div>
		);
	}
}

export default connect(({searchhouse})=>({
	filters : searchhouse.filters
}))(HouseArea);