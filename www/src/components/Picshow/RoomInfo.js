import React from 'react';
import {connect} from "dva";
import classnames from "classnames";

class RoomInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    let {item , index , dispatch} = this.props; 
    if(!item) return null;
    return (
      <div className="albums" onClick={()=>dispatch({"type" : "picshow/changealbum" ,"nowalbum" : index})}>
        <ul>
            <li>{item.room_name}</li>
            <li>面积：{item.room_area}㎡</li>
            <li>{item.ischecked?"已入住":"可入住"}</li>
            <li>朝向：{item.position}</li>
            <span><b>￥{item.price}</b>元/月(季付)</span>
        </ul>
      </div>
    );
  }
}

export default connect(
  ({picshow}) => ({
    houseinfo: picshow.houseinfo,
    nowalbum: picshow.nowalbum
  })
)(RoomInfo);