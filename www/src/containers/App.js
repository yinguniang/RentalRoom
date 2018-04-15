import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
import { push } from "react-router-redux";
import { connect } from "dva";

import "./App.less";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			collapsed: false
		}
	}
	
	onCollapse(collapsed) {
		this.setState({ collapsed });
	}
	render() {
		let {pathname , children ,dispatch} = this.props;
		let direc = "/";
		if(/^\/(.+)\//g.test(pathname)){
			direc = pathname.match(/^\/(.+)\//g)[0];
		}
		return (
			<div>
				<Layout style={{ minHeight: '100vh' }}>
					<Sider
						collapsible
						collapsed={this.state.collapsed}
						onCollapse={this.onCollapse.bind(this)}
					>
						<div className="logo" />
						<Menu theme="dark"
							  defaultSelectedKeys={[direc]}
							  mode="inline"
							  onClick={(e)=>{
								//不能跳转到同一个页面
								if(e.item.props.href == pathname) return;								
								dispatch(push(e.item.props.href));
							}}
						>
							<Menu.Item key="/" href="/">
								<Icon type="search" />
								<span>查找房源</span>
							</Menu.Item>
							<Menu.Item key="addhouse" href="/addhouse" >
								<Icon type="upload"/>
								<span>上传房源</span>
							</Menu.Item>
							<Menu.Item key="hot" href="/hot">
								<Icon type="pie-chart" />
								<span>热门房源</span>
							</Menu.Item>
						</Menu>
					</Sider>
					<Layout>
						<Content style={{ margin: '0 16px' }}>
							<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
								{children}
							</div>
						</Content>
						<Footer style={{ textAlign: 'center' }}>
								Ant Design ©2016 Created by Ant UED
						</Footer>
					</Layout>
				</Layout>
			</div>
		);
	}
}

export default connect(
	({routing}) => ({
		pathname : routing.location.pathname ,
		location : routing.location
	})
)(App);