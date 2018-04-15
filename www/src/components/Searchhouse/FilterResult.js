import React from "react";
import { Table, Row, Col, Button, Modal, Dropdown, Menu ,Pagination,Input ,Icon} from "antd";
import { connect} from "dva";
import moment from "moment";
const ButtonGroup = Button.Group;
import {push} from "react-router-redux";

import * as columns from "./columns.js";
import MyModal from "./MyModal";

class FilterResult extends React.Component{
    constructor(){
        super();
        //调用本地存储
        //判断本地存储中有没有
        this._clearFilters = this._clearFilters.bind(this);
        if (!localStorage.getItem("cols")){
            var defcols = ["id", "images", "updatedate","area","estate","areadetail", "price", "subway", "floorspace", "floor", "orientation", "nearsubway"];
        }else{
            var defcols = JSON.parse(localStorage.getItem("cols"));
        }

        this.state = {
            isShowModal : false ,   //是否弹出模态框
            isShowEditModal : false ,   //是否弹出模态框
            cols: defcols
        }
    }

    _clearFilters(){
        this.props.dispatch({"type": "searchhouse/clearFilter"})
    }

    componentDidMount(){
        var self = this;
        $(this.refs.tablebox).delegate("div[data-img]" , "click" , function(){
            let id = $(this).data("img");
             self.props.dispatch({"type" : "searchhouse/changeStars", id});
             self.timer = setTimeout(()=>{
                self.props.dispatch(push("/details/" + id));
             },0);
        });
    }
    componentWillUnmount(){
        $(this.refs.tablebox).off("click");
        if(this.timer){
            clearTimeout(this.timer);
        }    
    }
    render(){
        let {cols,isShowModal,isShowEditModal,editingID} = this.state;
        let {houses,pageinfo,sortinfo,total,dispatch} = this.props;
        //根据state定义的列的顺序，定义表格的列
        //这里要进行项的改变，受控sorter
        const columnArr = cols.map(item => {
            if(item != sortinfo.sortby){
                return columns[item];
            }
            return {
                ...columns[item] ,
                "sortOrder": sortinfo.sortdirection == 1 ? "ascend" : "descend"
            }
        });

        //补充一列
        columnArr.push({
            title : "操作",
            dataIndex: 'id',
            key : "do",
            render(text, record){
                return <div>
                    <Button onClick={()=>{
                        dispatch({"type" : "searchhouse/changeStars", "id":text});
                        dispatch(push("/details/" + record.id));                                        
                    }}><Icon type="link" /></Button>
                    <Button onClick={()=>{
                        dispatch(push("/updatehouse/" + record.id));
                    }}><Icon type="edit" /></Button>
                </div>
            }
        })

        //临时数组
        var tempCols = [];
        const setTempCols = (__tempCols) => {
            tempCols = __tempCols;
        }

        return <div className="tablebox" ref="tablebox">
            <Row>
                <Col span="6">
                    <span style={{"fontWeight" : "bold"}}>共<span style={{"fontSize" : "20px"}}>{total}</span>
                    个房子符合条件 当前{pageinfo.page} / {Math.ceil(total / pageinfo.pagesize)} 页</span>
                </Col>
                <Col span="13">
                </Col>
                <Col span="3">
                    <Button type="primary" icon="setting" onClick={this._clearFilters}>清除筛选</Button>
                </Col>
                <Col span="2">
                    <Button 
                        type="primary" 
                        icon="setting" 
                        onClick={() => { 
                            this.setState({"isShowModal" : true})
                        }}
                    >更改列</Button>
                </Col>
            </Row>

            <Modal
                title="更改列"
                visible={isShowModal}
                onOk={()=>{
                    //不仅仅关闭模态框，而且设置
                    this.setState({ 
                        "isShowModal": false ,
                        "cols" : tempCols
                    });

                    //改变本地存储
                    localStorage.setItem("cols" , JSON.stringify(tempCols));
                }}
                onCancel={() => {
                    //只关闭模态框
                    this.setState({ "isShowModal": false })
                }}
                destroyOnClose={true}
            >
                <MyModal cols={cols} setTempCols={setTempCols.bind(this)}></MyModal>
            </Modal>

           <Table 
                dataSource={houses} 
                columns={columnArr} 
                pagination = {{
                    current : pageinfo.page ,
                    pageSize : pageinfo.pagesize,
                    total : total,
                    showSizeChanger : true,                    
                }}
                onChange={(pagination , filter , sorter)=>{
                    //这个onChange事件什么时候触发？？
                    //1 换页的时候
                    //2 改变pagesize的时候
                    //3 改变排序的时候
                    if(pagination.current != pageinfo.page || pagination.pageSize != pageinfo.pagesize){
                        dispatch({
                            "type": "searchhouse/changePage",
                            "page": pagination.current,
                            "pagesize": pagination.pageSize
                        });
                        return;
                    }
                   
                    var temp = sortinfo.sortdirection == 1 ? "ascend" : "descend";
                    if (sorter.columnKey != sortinfo.sortby || sorter.order != temp){
                        dispatch({
                            "type": "searchhouse/changeSort",
                            "sortby": sorter.columnKey,
                            "sortdirection": sorter.order == "ascend" ? 1 : -1
                        });
                        console.log(sorter.columnKey)
                    }
                }}
                rowKey="id"
            />
        </div>
    }
}

export default connect(
    ({searchhouse})=>({
        houses : searchhouse.houses ,
        pageinfo : searchhouse.pageinfo,
        sortinfo : searchhouse.sortinfo, 
        total : searchhouse.total       
    })
)(FilterResult);