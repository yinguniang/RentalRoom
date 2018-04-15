var path = require("path");
var fs = require("fs");
var mockjs = require("mockjs");
var Random = mockjs.Random;

 
//生成的文件的地址
var targetfile = path.resolve(__dirname, "userdata.txt");

//先删除要得到的文件
fs.writeFileSync(targetfile , "");
 
for (let i = 0; i < 20 ; i++){
    let o = {};
    o.id = i+1;
    //姓名
    o.name = Random.cname();
    //手机号
    o.mobile = Random.integer(10000000000 , 99999999999).toString();
    //房源
    o.h_resources = Random.integer(1 , 10).toString();
    //评价
    o.h_comments = Random.integer(50 , 100).toString();

    //直接追加到文件中\
    fs.appendFileSync(targetfile, JSON.stringify(o) + "\n\r");
}
 

