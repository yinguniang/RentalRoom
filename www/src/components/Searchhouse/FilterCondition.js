import React from 'react';
import {Row , Col} from "antd";

import CommonCondition from "./filter_controls/CommonCondition.js";
import Area from "./filter_controls/Area.js";
import AreaDetail from "./filter_controls/AreaDetail.js";
import Subway from "./filter_controls/Subway.js";
import Station from "./filter_controls/Station.js";
import Price from "./filter_controls/Price.js";
import HouseArea from "./filter_controls/HouseArea.js";
import Floor from "./filter_controls/Floor.js";
import Updatedate from "./filter_controls/Updatedate.js";
import Islockorsubway from "./filter_controls/Islockorsubway.js";
import Tags from "./filter_controls/Tags.js";

export default class FilterCondition extends React.Component {
	constructor(props) {
        super(props);
        this._setAreaDetail = this._setAreaDetail.bind(this);
        this._setStation = this._setStation.bind(this);
        this.state = {
            nowareadetails : [],
            nowstation : []
		}
	}
    _setAreaDetail(nowareadetails){
        this.setState({nowareadetails});
    }
    _setStation(nowstation){
        this.setState({nowstation});
    }
	render() {
        let nowareadetails = this.state.nowareadetails;
        let nowstation = this.state.nowstation;
		return (
			<div>
                <Row>
					<Col span="3">
                        区域：
					</Col>
					<Col span="21">
                        <Area _setAreaDetail={this._setAreaDetail} />
					</Col>
				</Row>
                {nowareadetails.length ? <Row>
                    <Col span="3">
                        街道：
					</Col>
                    <Col span="21">
                        <AreaDetail  nowareadetails={nowareadetails} _setAreaDetail={this._setAreaDetail} />
                    </Col>
                </Row>
                    : null}
                <Row>
					<Col span="3">
                        地铁：
					</Col>
					<Col span="21">
                        <Subway _setStation={this._setStation} />
					</Col>
				</Row>
                {nowstation.length ? <Row>
                    <Col span="3">
                        地铁站：
					</Col>
                    <Col span="21">
                        <Station  nowstation={nowstation} _setStation={this._setStation} />
                    </Col>
                </Row>
                    : null}
				<Row>
					<Col span="3">
						房间个数：
					</Col>
					<Col span="21">
						<CommonCondition options={[1,2,3,4,5]} propsname="roomAmount" />
					</Col>
				</Row>
                <Row>
					<Col span="3">
						供暖方式：
					</Col>
					<Col span="21">
						<CommonCondition options={["集体供暖","独立供暖","中央供暖"]} propsname="heating" />
					</Col>
				</Row>
                <Row>
					<Col span="3">
						朝向：
					</Col>
					<Col span="21">
						<CommonCondition options={["东","南","西","北"]} propsname="orientation" />
					</Col>
				</Row>
                <Row>
					<Col span="3">
						租金（元）：
					</Col>
					<Col span="21">
						<Price />
					</Col>
				</Row>
				<Row>
					<Col span="3">
						面积（平里）：
					</Col>
					<Col span="21">
						<HouseArea />
					</Col>
				</Row>
                <Row>
					<Col span="3">
						楼层：
					</Col>
					<Col span="21">
						<Floor />
					</Col>
				</Row>
                <Row>
					<Col span="3">
						上传日期：
					</Col>
					<Col span="21">
						<Updatedate />
					</Col>
				</Row>
                <Row>
					<Col span="3">
						其他：
					</Col>
					<Col span="21">
						<Row>
							<Col span="5">
								<Islockorsubway chinese="是否有智能锁" options={["是","否"]} propsname="intelligentlock" />
							</Col>
							<Col span="5">
								<Islockorsubway chinese="是否临近地铁" options={["是","否"]} propsname="nearsubway" />
							</Col>
						</Row>
					</Col>
				</Row>
				<Row className="lastRow">
					<Col span="3">
					<span style={{"fontSize" : "18px","fontWeight" : "bold"}}>当前：</span>
					</Col>
					<Col span="21">
						<Tags />
					</Col>
				</Row>
			</div>
		);
	}
}


