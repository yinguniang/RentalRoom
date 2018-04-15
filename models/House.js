var mongoose = require("mongoose");

//这就是一个model文件
module.exports = mongoose.model("House" , {
	"id" : Number , 
	"stars" : Number , 
	"estate" : String,
	"ischecked" : Boolean,
	"owner" : String,
	"area" : String,
	"areadetail" : String,
	"subway" : Array,
	"station" : String,
	"roomAmount" : Number,
	"rooms" : Array,
	"otherviews" : Array,
	"price" : Number,
	"floorspace" : Number,
	"floor" : Number,
	"heating" : String,
	"orientation" : String,
	"intelligentlock" : Boolean,
	"nearsubway" : Boolean,
	"updatedate" : Number,
	"files" : Array
});