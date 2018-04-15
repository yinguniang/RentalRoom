import React from 'react';
import {connect} from "dva";
import cn from "classnames";

class AreaDetail extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps){
		//这里的思路是，如果全局的area是空白了，此时就要告诉父亲要把数组置位空
		//也通知全局将街道的过滤器变为""
		//为了防止死循环，必须验证area这一次改变才置空。
		if(nextProps.filters.area == "" && this.props.filters.area != ""){
			this.props._setAreaDetail([]);
			if(this.props.filters.areadetail){
				this.props.dispatch({"type":"searchhouse/changeFilter" , "propsname" : "areadetail" , "value" : ""});			
			}
			
		}
	}

	render() {
		let {nowareadetails,filters,dispatch} = this.props;
		return (
			<div>
				{
					nowareadetails.map((item,index)=>{
						return <em 
							key={index}
							onClick={()=>{	 
								//告诉全局
								dispatch({
									"type": "searchhouse/changeFilter" , 
									"propsname" : "areadetail", 
									"value" : item
								})
							}}
							className={cn({"cur" : filters.areadetail == item})}
						>
							{item}
						</em>
					})
				}
			</div>
		);
	}
}


export default connect(({searchhouse})=>({
	filters : searchhouse.filters,
	search : searchhouse.search
}))(AreaDetail);