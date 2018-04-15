import React from 'react';
import {Tag } from "antd";
import {connect} from "dva";
import moment from "moment";

class Tags extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		//词典
		const dictionary = {
			"area" : "区域",
			"areadetail" : "街道",
			"subway" : "地铁",
			"station" : "地铁口",
			"roomAmount" : "房间",
			"price" : "价格",
			"floorspace" :"面积",
			"floor" :"楼层",
			"heating" : "供暖方式",
			"orientation" : "朝向",
			"intelligentlock" : "是否有智能锁",
			"nearsubway" : "是否临近地铁",
			"updatedate" : "上传日期"
		}
		let {filters,search,dispatch} = this.props;
		return (
			<div>
				{
					/*这里就是在遍历store中的filters对象，生成一个个Tag*/
					Object.keys(filters).map(item=>{
						if(filters[item].length == 0) return null;
						
						switch (item) {
							case "area":
							case "areadetail":
							case "subway":
							case "station":
							case "intelligentlock" :
							case "nearsubway":
								return <Tag
									closable
									onClose={(e) => {
										e.preventDefault();
										dispatch({ "type": "searchhouse/changeFilter", "propsname": item, "value": "" });		
									}}
									key={item}
								>
									{dictionary[item]}：{filters[item]}
								</Tag>
								break;
							case "roomAmount":
							case "heating":
							case "orientation":
								return <Tag
									closable
									onClose={(e) => {
										e.preventDefault();
										dispatch({ "type": "searchhouse/changeFilter", "propsname": item, "value": [] });
									}}
									key={item}
								>
									{dictionary[item]}：{filters[item].join(" 或 ")}
								</Tag>
								break;
							case "price" : 
								if(filters[item][0] == 800 && filters[item][1] == 12000) return null;
								return <Tag 
									closable
									onClose={(e)=>{
										e.preventDefault();
										dispatch({"type":"searchhouse/changeFilter" , "propsname" : item , "value" : [800,12000]});
									}}
									key={item}
									>
									{dictionary[item]}：{filters[item].join("-")}
								</Tag>
								break;
							case "floorspace" : 
								if(filters[item][0] == 40 && filters[item][1] == 160) return null;
								return <Tag 
									closable
									onClose={(e)=>{
										e.preventDefault();
										dispatch({"type":"searchhouse/changeFilter" , "propsname" : item , "value" : [40,160]});
									}}
									key={item}
									>
									{dictionary[item]}：{filters[item].join("-")}
								</Tag>
								break;
							case "floor" : 
								if(filters[item][0] == 1 && filters[item][1] == 12) return null;
								return <Tag 
									closable
									onClose={(e)=>{
										e.preventDefault();
										dispatch({"type":"searchhouse/changeFilter" , "propsname" : item , "value" : [1,12]});
									}}
									key={item}
									>
									{dictionary[item]}：{filters[item].join("-")}
								</Tag>
								break;
							case "updatedate" : 
								return <Tag
									closable
									onClose={(e) => {
										e.preventDefault();
										dispatch({ "type": "searchhouse/changeFilter", "propsname": item, "value": [] });
									}}
									key={item}
									>
									{dictionary[item]}
									：
									{
										filters[item].map(item => {
											return moment(item).format("YY年MM月DD日")
										}).join("-")
									}
								</Tag>
								break;
							default :
								return null;
						}						
					})
				}
			</div>
		);
	}
}

export default connect(
	({searchhouse}) => ({
		filters : searchhouse.filters,
		search : searchhouse.search
	})
)(Tags);