import React from 'react';
import {connect} from "dva";
import classnames from "classnames";

class Houselikes extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount(){
		let btop = 0;	//这是b滑块的top值
		let self = this;

		//拖拽的事件，让b可以被拖拽
		$(this.refs.b).draggable({
			containment : "parent",			//限制拖拽的盒子
			drag(event , ui){
				btop = ui.position.top; 	//设置btop值
				//让ul上移，按比例移动
				$(self.refs.ul).css("top" , -btop * self.rate);
			}
		});

		//鼠标滚轮
		$(this.refs.contentbox).mousewheel(function(event,delta){
			event.preventDefault();		//阻止默认事件
			btop -= delta * 8;
			//验收
			if(btop < 0) btop = 0;
			let maxtop = $(self.refs.contentbox).height() - $(self.refs.b).height();
			if(btop > maxtop) btop = maxtop;
			$(self.refs.ul).css("top" , -btop * self.rate);
			$(self.refs.b).css("top" , btop);
		});
	}

	componentDidUpdate(){
		//更新完毕，此时ul就会有高度
		//之所以要this. 是因为生命周期函数要通信。
		this.ulheight = $(this.refs.ul).height();
		this.rate =  $(this.refs.ul).height() / $(this.refs.contentbox).height();
		//设置b的高度，按比例设置
		$(this.refs.b).height($(this.refs.contentbox).height() / this.rate);
	}

	render() {
		let {houseinfo,houselike,nowid,dispatch} = this.props;
		return (
			<div className="houselikes">
				<h3>更多{houseinfo.station}附近的房源</h3>
				<div className="contentbox" ref="contentbox">
					<ul ref="ul">
						{
							houselike.map(item=>{
								return <li 
									key={item.id} 
									className={classnames({
										"cur" : nowid == item.id
									})}
									onClick={()=>{dispatch({"type":"picshow/init" , "nowid" : item.id})}}
								>
									{item.estate}{item.roomAmount}居室
									<span><b>￥{item.price}</b>元/月(季付)</span>
									{item.floorspace}㎡
									{new Date(item.updatedate).getMonth() +1 }月上传									
								</li>
							})
						}
					</ul>
					<div className="bar">
						<b ref="b"></b>
					</div>
				</div>
			</div>
		);
	}
}


export default connect(
	({picshow}) => ({
		houselike : picshow.houselike ,
		houseinfo : picshow.houseinfo ,
		nowid : picshow.nowid
	})
)(Houselikes);