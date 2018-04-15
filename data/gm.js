/*
******处理大图生成小图****************************************************************
*/
const express = require("express");
const app = express();
const formidable = require("formidable");
const path = require("path");
const url = require("url");
const fs = require("fs");
const gm = require("gm");

//链接数据库
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/rentinghouse");		

//引入模型文件
const House = require("./models/House.js");

House.find({}).exec((err, docs) => {
    for(let k=0,length=docs.length ; k<1 ; k++){
        console.log("START");
        let images2 = docs[k].otherviews;    
        let id = docs[k].id;        
        let roomAmount = docs[k].roomAmount;
        fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images_small/" + id));
        fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images_small/" + id + "/otherviews"));
        for (let n = 0,length2=images2.length ; n < length2 ; n++) {
            console.log(n);        
            //改变为小图
            gm(path.resolve(__dirname, "./www/images/room_images/" + id + "/otherviews/" + images2[n]))
            .resize(180, 135)
            .write(path.resolve(__dirname, "./www/images/room_images_small/" + id + "/otherviews/" + images2[n]),function(){})    
        }


        for (let m = 0; m < roomAmount; m++) {
            let imagepath = docs[k].rooms[m].path;
            let images = docs[k].rooms[m].images;
            fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images_small/" + id + "/" + imagepath));
            for (let i = 0,length3=images.length ; i < length3 ; i++) {
                //改变为小图
                gm(path.resolve(__dirname, "./www/images/room_images/" + id + "/" + imagepath +"/"+ images[i]))
                .resize(180, 135)
                .write(path.resolve(__dirname, "./www/images/room_images_small/" + id + "/" + imagepath +"/" + images[i]))
            }
        }
        console.log("END");
    }
})