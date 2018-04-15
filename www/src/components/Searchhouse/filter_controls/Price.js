import React from 'react';
import {Slider , Row , Col , Button} from "antd";
import {connect} from "dva";

class Price extends React.Component {	 
	constructor(props) {
		super(props);

		//“过继”一下全局price-内部state
		this.state = {
			price : props.filters.price
		}
	}
	//当全局数据要改变的时候
	componentWillReceiveProps(props){
		//重新“过继”一下全局price-内部state
		this.setState({price : props.filters.price})
	}

	render() {
        let {dispatch} = this.props;
		return (
			<div>
				<Row>
					<Col span="9" >
						<Slider 
							range
							min={800} 
							max={12000}
							defaultValue={this.state.price}
							value={this.state.price}
							onChange={(value)=>{
								this.setState({"price" : value})
							}}
							onAfterChange={(value)=>{
								dispatch({"type":"searchhouse/changeFilter" , "propsname" : "price" , value})
							}}
						></Slider>
					</Col>
					<Col span="1"></Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({"type":"searchhouse/changeFilter" , "propsname" : "price" , "value" : [800,2000]})
						}}>
							800-2000元
						</Button>
					</Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({"type":"searchhouse/changeFilter" , "propsname" : "price" , "value" : [2000,3500]})
						}}>
							2000-3500元
						</Button>
					</Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({"type":"searchhouse/changeFilter" , "propsname" : "price" , "value" : [3500,6000]})
						}}>
							3500-6000元
						</Button>
					</Col>
					<Col span="3">
						<Button onClick={()=>{
							dispatch({"type":"searchhouse/changeFilter" , "propsname" : "price" , "value" : [6000,12000]})
						}}>
							6000元以上
						</Button>
					</Col>
				</Row>
			</div>
		);
	}
}

export default connect(({searchhouse})=>({
	filters : searchhouse.filters
}))(Price);