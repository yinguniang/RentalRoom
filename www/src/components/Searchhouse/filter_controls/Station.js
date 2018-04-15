import React from 'react';
import {connect} from "dva";
import cn from "classnames";

class Station extends React.Component {
	constructor(props) {
		super(props);
	}

	componentWillReceiveProps(nextProps){
		//这里的思路是，如果全局的subway是空白了，此时就要告诉父亲要把数组置位空
		//也通知全局将地铁口的过滤器变为""
		//为了防止死循环，必须验证subway这一次改变才置空。
		if(nextProps.filters.subway == "" && this.props.filters.subway != ""){
			this.props._setStation([]);
			if(this.props.filters.station){
				this.props.dispatch({"type":"searchhouse/changeFilter" , "propsname" : "station" , "value" : ""});				
			}
		}
	}

	render() {
		let {nowstation,filters,dispatch} = this.props;
		return (
			<div>
				{
					nowstation.map((item,index)=>{
						return <em 
							key={index}
							onClick={()=>{	 
								//告诉全局
								dispatch({
									"type": "searchhouse/changeFilter" , 
									"propsname" : "station", 
									"value" : item
								})
							}}
							className={cn({"cur" : filters.station == item})}
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
	filters : searchhouse.filters
}))(Station);