import React from "react";

export default class MyModal extends React.Component{
    constructor(){
        super();
    }
    componentDidMount(){
        var self = this;
        //实现拖拽排序
        $("#ul1 , #ul2").sortable({
            connectWith: ".connectedSortable" ,
            //当sort发生的时候做的事情
            stop : function(){
                var arr = [];
                var $lis = $(self.refs.ul1).find("li");
                $lis.each(function(){
                    arr.push($(this).data("e"));
                });
                self.props.setTempCols(arr);
                console.log($lis);
            }
        }).disableSelection();
    }
    render(){
        let {cols} = this.props;
        const dictionary = {
            "id" : "id",
            "images" : "缩略图",
            "estate" : "小区",
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
			"ischecked" : "是否可入住",
			"updatedate" : "上传日期"
        };

        return <div className="mymodal">
            <h3>当前列</h3>
            <ul ref="ul1" id="ul1" className="connectedSortable">
                {
                    cols.map((item,index)=>{
                        return <li key={index} data-e={item}>
                            {dictionary[item]}
                        </li>
                    })
                }
            </ul>
            <hr />
            <h3>没有被添加的列</h3>
            <ul ref="ul2" id="ul2" className="connectedSortable">
                {
                    Object.keys(dictionary).filter(item=>{
                        return !cols.includes(item);
                    }).map((item, index) => {
                        return <li key={index} data-e={item}>
                            {dictionary[item]}
                        </li>
                    })
                }
            </ul>
        </div>
    }
}