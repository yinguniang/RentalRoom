import React from "react";
import moment from "moment";

export const id = {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
    sorter: true
}
export const images = {
    title: '缩略图',
    dataIndex: 'images',
    key: 'images',
    render(text, record) {
        return <div data-img={record.id}>
            <img className="prviewsmallpic" src={`images/room_images_small/${record.id}/room1/${record.rooms[0].images[0]}`} alt="room1" />
        </div>
    }
}
export const estate = {
    title: '小区',
    dataIndex: 'estate',
    key: 'estate'
}
export const area = {
    title: '区域',
    dataIndex: 'area',
    key: 'area'
}
export const areadetail = {
    title: '街道',
    dataIndex: 'areadetail',
    key: 'areadetail',
}
export const subway = {
    title: '地铁',
    dataIndex: 'subway',
    key: 'subway'
}
export const station = {
    title: '地铁站',
    dataIndex: 'station',
    key: 'station'
}

export const roomAmount = {
    title: '房间',
    dataIndex: 'roomAmount',
    key: 'roomAmount',
    sorter: true
}

export const price = {
    title: '租金',
    dataIndex: 'price',
    key: 'price',
    sorter: true
}
export const floorspace = {
    title: '面积',
    dataIndex: 'floorspace',
    key: 'floorspace',
    sorter: true
}
export const floor = {
    title: '楼层',
    dataIndex: 'floor',
    key: 'floor',
    sorter: true
}
export const heating = {
    title: '供暖方式',
    dataIndex: 'heating',
    key: 'heating'
}
export const orientation = {
    title: '朝向',
    dataIndex: 'orientation',
    key: 'orientation'
}
export const intelligentlock = {
    title: '是否有智能锁',
    dataIndex: 'intelligentlock',
    key: 'intelligentlock',
    render(text, record) {
        return record.intelligentlock ? <span>是</span> : <span>否</span>
    },
    sorter: true
}
export const nearsubway = {
    title: '是否临近地铁',
    dataIndex: 'nearsubway',
    key: 'nearsubway',
    render(text, record) {
        return record.nearsubway ? <span>是</span> : <span>否</span>
    },
    sorter: true
}

export const ischecked = {
    title: '可入住',
    dataIndex: 'ischecked',
    key: 'ischecked',
    render(text, record) {
        return record.ischecked ? <span>已租出</span> : <span>可入住</span>
    },
    sorter: true
}

export const updatedate = {
    title: '上传日期',
    dataIndex: 'updatedate',
    key: 'updatedate',
    render(text, record, index) {
        return <span>
            {moment(text).format("YY年MM月DD日")}
        </span>
    },
    sorter: true
}



