import React from 'react';
import { Tabs  } from 'antd';
const TabPane = Tabs.TabPane;
import {connect} from "dva";
import cn from "classnames";

class Subway extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			options : {}		//地铁线和地铁口的对象
		}	
	}

	componentDidMount(){
		//拉取接口
		this.loadServer((subway)=>{
			this.setState({options : subway})
		});
	}
	//拉取接口
	async loadServer(callback){
		//请求接口，获得后台给我们的区域里的街道信息
		const {subway} = await fetch("/subway").then(response=>response.json());
		callback(subway);
	}

	render() {
		let {options} = this.state;
		let {_setStation,filters,dispatch} = this.props;
		return (
			<ul className="area">
				{
					Object.keys(options).map((item,index) => {
						return <li key={index}>
							<em
								onClick={() => {
									//点击em之后，调用父亲传给我的函数
									_setStation(options[item]);
									//告诉全局
									dispatch({
										"type": "searchhouse/changeFilter",
										"propsname": "subway",
										"value": item
									})
								}}
								className={cn({ "cur": filters.subway == item })}
							>
								{item}
							</em>
						</li>
					})
				}
			</ul>
		);
	}
}

export default connect(({searchhouse})=>({
	filters : searchhouse.filters
}))(Subway);