import React from 'react';
import { Tabs  } from 'antd';
const TabPane = Tabs.TabPane;
import {connect} from "dva";
import cn from "classnames";

class Area extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			options : {}		//区域和街道的对象
		}	
	}

	componentDidMount(){
		//拉取接口
		this.loadServer((result)=>{
			this.setState({options : result})
		});
	}
	//拉取接口
	async loadServer(callback){
		//请求接口，获得后台给我们的区域里的街道信息
		const result = await fetch("/areas").then(response=>response.json());
		callback(result);
	}

	render() {
		let {options} = this.state;
		let {_setAreaDetail,filters,dispatch} = this.props;
		return (
			<ul className="area">
				{
					Object.keys(options).map((item,index) => {
						return <li key={index}>
							<em
								onClick={() => {
									//点击em之后，调用父亲传给我的函数
									_setAreaDetail(options[item]);
									//告诉全局
									dispatch({
										"type": "searchhouse/changeFilter",
										"propsname": "area",
										"value": item
									});									
								}}
								className={cn({ "cur": filters.area == item })}
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
}))(Area);