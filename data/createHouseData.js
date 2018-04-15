/**
 * 这个文件用来创建房源的数据
 */

const path = require("path");
const fs= require("fs");
const _ = require("lodash");

//基数据的文件的路径
const basedataFilePath = path.resolve(__dirname , "./housebasedata.json");
//生成的文件的路径
var targetfile = path.resolve(__dirname , "./housedata.txt");

//先删除要得到的文件
fs.writeFileSync(targetfile , "");

var arr = JSON.parse(fs.readFileSync(basedataFilePath).toString());

for(let i = 0 ; i < arr.length ; i++){
	arr[i].id = i+1;
	arr[i].files = [];
	//热门指数
	arr[i].stars = _.random(1 , 12);
	//是否可入住
	arr[i].ischecked = false;
	//小区名字
	arr[i].estate  = _.sample(["加州水郡三期","马坡花园一区","金地朗悦沁园","静心苑","天资华府","樱花园","星河皓月"]);
	//居住面积-40平米~160平米
	arr[i].floorspace = _.random(40 , 160);	
	//楼层								
	arr[i].floor  = _.random(1 , 12);
	//供暖方式
	arr[i].heating  = _.sample(["集体供暖","独立供暖","中央供暖"]);
	//朝向
	arr[i].orientation  = _.sample(["东","南","西","北"]);
	//是否含有智能锁
	arr[i].intelligentlock  = _.sample([true,false]);
	//是否就近地铁
	arr[i].nearsubway  = _.sample([true,false]);
	//上传日期-近半年内的房源	
	arr[i].updatedate = Date.parse(new Date(2018,3,1)) - _.random(0 , 365 * 86400 * 1000 / 2);		
	 //直接追加到文件中
    fs.appendFileSync(targetfile , JSON.stringify(arr[i]) + "\r\n");
}