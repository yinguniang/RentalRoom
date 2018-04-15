import React, { Component } from 'react';
import {connect} from "dva";

class ShowHot extends Component {
    constructor(props){
        super(props);
    }
    
    render() {
        let id = this.props.item.id;
        let filename = this.props.item.rooms[0].images[0];
        let area = this.props.item.area;      
        let areadetail = this.props.item.areadetail;    
        let estate = this.props.item.estate;    
        let price = this.props.item.price;    
        let roomAmount = this.props.item.roomAmount;
        let floorspace = this.props.item.floorspace;
        let subway = this.props.item.subway;
        return (
            <div className="imgbox" data-img={id}>
                <div>
                      <img className="prviewsmallpic" src={`images/room_images_small/${id}/room1/${filename}`} alt={id} />
                </div>
                <div className="imginfo">
                    <p>{`[${area}区-${areadetail}]${estate}`}</p>
                    <p><span>{price}元</span></p>
                    <p><span>{subway.join("、")}</span></p>
                    <p><span>{roomAmount}室{floorspace}平米</span></p>
                </div>
            </div>
        )
    }
}

export default connect()(ShowHot);
