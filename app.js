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
const User = require("./models/User.js");

//静态化www文件夹
app.use(express.static("www"));

//接口，查询某一个id的房子的信息（包括images）
app.get("/houseinfo/:id", (req, res) => {
  //得到:id的值
  let id = req.params.id;
  //查询数据库
  House.find({id}).exec((err, results) => {
    res.json({"result": results[0]});
  });
});

//接口，查询和某一个id的同地铁口的房源
app.get("/houselike/:id", (req, res) => {
  //得到:id的值
  let id = req.params.id;
  //先要知道查的这个车的品牌、车系
  House.find({id}).exec((err, results) => {
    //得到你查询的这个id的品牌和车系
    let station = results[0].station;
    //继续查询
    House.find({station, "id": {"$not": {"$eq": id}}}).exec((err, houselike) => {
      res.json({houselike});
    });
  });
});
//得到用户信息
app.get("/users/:mobile", function (req, res) {
  User.find({"mobile": req.params.mobile}, function (err, docs) {
    if (docs.length) {
      res.json({"result": docs[0]});
    } else {
      res.json({"result": {}});
    }
  });
});

const area = {
  "朝阳": ["国贸", "大望路", "望京", "三里屯", "亚运村", "三元桥"],
  "西城": ["西直门", "新街口", "宣武门", "西单"],
  "海淀": ["西二旗", "西三旗", "中关村", "知春路", "五棵松", "五道口"],
  "东城": ["崇文门", "建国门"],
  "丰台": ["北京南站", "五棵松", "宋家庄", "蒲黄榆"],
  "通州": ["果园", "武夷花园", "通州北苑"]
};
//全部的区域和街道
app.get("/areas", function (req, res) {
  res.json(area);
});

const subway_const = {
  "1号线": ["五棵松", "王府井", "西单", "东单", "建国门", "国贸", "大望路", "四惠", "四惠东"],
  "2号线": ["西直门", "雍和宫", "宣武门", "朝阳门", "建国门", "北京站", "崇文门", "西单"],
  "4号线": ["宣武门", "北京南站", "西单", "新街口", "西直门", "中关村"],
  "5号线": ["崇文门", "东单", "宋家庄", "蒲黄榆", "天通苑", "天通苑南", "天通苑北"],
  "10号线": ["知春路", "三元桥", "太阳宫", "芍药居", "国贸", "宋家庄"],
  "13号线": ["西直门", "知春路", "五道口", "西二旗", "东直门"],
  "14号线": ["蒲黄榆", "大望路", "望京", "北京南站", "朝阳公园", "望京南", "十里河", "永定门外"],
  "15号线": ["顺义", "望京", "望京东", "望京西", "奥利匹克公园", "六道口"],
  "昌平线": ["昌平", "西二旗", "昌平站", "朱辛庄", "十三陵景区"]
};
//全部的地铁线和地铁站
app.get("/subway", function (req, res) {
  res.json({"subway": subway_const});
});

//北京各区域房价分布图
app.get("/pie", function (req, res) {
  let results = [];
  let arr = ["朝阳", "西城", "海淀", "东城", "丰台", "通州"];
  let sum = 0;
  House.find({"area": arr[0]}).exec((err, docs) => {
    let length = docs.length;
    for (let j = 0; j<length; j++) {
      sum += docs[j].price;
    }
    results[0] = parseInt(sum / length);
    sum = 0;
    House.find({"area": arr[1]}).exec((err, docs) => {
      let length = docs.length;
      for (let j = 0; j<length; j++) {
        sum += docs[j].price;
      }
      results[1] = parseInt(sum / length);
      sum = 0;
      House.find({"area": arr[2]}).exec((err, docs) => {
        let length = docs.length;
        for (let j = 0; j<length; j++) {
          sum += docs[j].price;
        }
        results[2] = parseInt(sum / length);
        sum = 0;
        House.find({"area": arr[3]}).exec((err, docs) => {
          let length = docs.length;
          for (let j = 0; j<length; j++) {
            sum += docs[j].price;
          }
          results[3] = parseInt(sum / length);
          sum = 0;
          House.find({"area": arr[4]}).exec((err, docs) => {
            let length = docs.length;
            for (let j = 0; j<length; j++) {
              sum += docs[j].price;
            }
            results[4] = parseInt(sum / length);
            sum = 0;
            House.find({"area": arr[5]}).exec((err, docs) => {
              let length = docs.length;
              for (let j = 0; j<length; j++) {
                sum += docs[j].price;
              }
              results[5] = parseInt(sum / length);
              sum = 0;
              res.json({results});
            });
          });
        });
      });
    });
  });
  
});

//接口，查询房子
app.post("/houses", function (req, res) {
  //fomidable语法
  var form = new formidable.IncomingForm();
  form.parse(req, (err, {filters, search, pageinfo, sortinfo}) => {
    //查询对象
    let queryobj = {};
    queryobj["ischecked"] = false;
    //得到页面的分页信息
    let page = pageinfo.page;
    let pagesize = pageinfo.pagesize;
    //得到页面的排序信息
    let sortby = sortinfo.sortby;
    let sortdirection = sortinfo.sortdirection;
    //修正一些词语：将前端发来的“是”、“否”变为true、false
    if (filters.intelligentlock != "") {
      filters.intelligentlock = filters.intelligentlock == "是" ? true : false;
    }
    if (filters.nearsubway != "") {
      filters.nearsubway = filters.nearsubway == "是" ? true : false;
    }
    //根据前端发来的对象，拼一个查询体
    for (let k in filters) {
      //数组类型的（复选框）、精确匹配的（品牌和类型）
      switch (k) {
        case "area":
        case "areadetail":
        case "subway":
        case "station":
        case "intelligentlock":
        case "nearsubway":
        case "roomAmount":
        case "heating":
        case "orientation":
          if (filters[k].length != 0) {
            queryobj[k] = filters[k];
          }
          break;
        case "price":
        case "floorspace":
        case "floor":
        case "updatedate":
          if (filters[k].length != 0) {
            //验证范围匹配
            queryobj[k] = {"$gte": filters[k][0], "$lte": filters[k][1]};
          }
          break;
      }
    }
    if (!search) {
      //进行总量的计算
      House.count(queryobj, (err, count) => {
        //进行查询
        House.find(queryobj).sort({[sortby]: sortdirection}).skip(pagesize * (page - 1)).limit(pagesize).exec((err, docs) => {
          res.json({
            "total": count, 	//数量
            "results": docs 	//结果
          });
        });
      });
    } else {
      const search_sql = {
        "$or": [
          {"estate": new RegExp(search, "g")},
          {"areadetail": new RegExp(search, "g")},
          {"subway": new RegExp(search, "g")},
          {"station": new RegExp(search, "g")}
        ]
      };
      let sql = Object.assign(queryobj, search_sql);
      // 进行总量的计算
      House.count(sql, function (err, amount) {
        House.find(sql).sort({[sortby]: sortdirection}).skip(pagesize * (page - 1)).limit(pagesize).exec((err, docs) => {
          res.json({
            "total": amount, 	//数量
            "results": docs 	//结果
          });
        });
      });
    }
  });
});

//接口，查询房子的热度
app.get("/stars", function (req, res) {
  House.find({}).sort({stars: -1}).limit(10).exec((err, docs) => {
    res.json({
      "hot": docs 	//结果
    });
  });
});

//接口，更改房子的热度
app.post("/stars", function (req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fileds, files) => {
    let id = fileds.id;
    House.find({id}, (err, results) => {
      if (err) throw err;
      let _stars = results[0].stars;
      _stars += 0.5;
      House.update({id}, {"$set": {"stars": _stars}}).exec((err) => {
        if (err) throw err;
        res.json("更改" + id + "stars成功");
      });
    });
  });
});

//上传
app.post("/uploadimages", function (req, res) {
  //生成multiparty对象，并配置上传目标路径
  let form = new formidable.IncomingForm();
  //上传文件夹
  form.uploadDir = path.resolve(__dirname, "./www/uploads");
  form.encoding = 'utf-8';        //设置编辑
  //保留拓展名
  form.type = true;
  form.keepExtensions = true;
  form.maxFieldsSize = 2 * 1024 * 1024;   //文件大小
  form.parse(req, function (err, content, files) {
    if (!files) return;
    //图片上传之后会被随机改名，此时将改变的名字发给前端
    //用path.basename()来得到最重要的文件名部分
    if(!err){
      Object.keys(files).forEach(function(key){
        let file = files[key];
        let filename = path.basename(file.path);
        res.send(filename);
      })
    }
  });
});


app.post("/uploadziliao", function (req, res) {
  let form = new formidable.IncomingForm();
  //上传文件夹
  form.uploadDir = path.resolve(__dirname, "./www/uploads");
  //保留拓展名
  form.keepExtensions = true;
  form.parse(req, function (err, content, files) {
    if (!files) return;
    //图片上传之后会被随机改名，此时将改变的名字发给前端
    //用path.parse()来得到最重要的文件名部分
    res.send(path.parse(files.file.path).base);
  });
});
//添加房子
app.post("/addhouse", function (req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, {step1, step2, step3}, file) {
    let {
      areaanddetail, subwayandstation, estate, owner, roomAmount, price,
      floorspace, floor, heating, orientation, intelligentlock, nearsubway, updatedate
    } = step1;
    let {rooms, otherviews} = step2;
    let {files} = step3;
    let area = areaanddetail.value[0];
    let areadetail = areaanddetail.value[1];
    let station = subwayandstation.value[1];
    let subway = [];
    for (let k in subway_const) {
      if (subway_const[k].includes(station)) {
        subway.push(k);
      }
    }
    let ischecked = false;
    let stars=0;
    estate = estate.value;
    owner = owner.value;
    roomAmount = roomAmount.value;
    price = price.value;
    floorspace = floorspace.value;
    floor = floor.value;
    heating = heating.value;
    orientation = orientation.value;
    intelligentlock = intelligentlock.value;
    nearsubway = nearsubway.value;
    
    //决定ID
    House.find({}).sort({"id": -1}).limit(1).exec((err, docs) => {
      let id = docs[0].id + 1;
      console.log("id:",id);
      //创建文件夹
      fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images/" + id));
      fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images_small/" + id));
      fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images/" + id + "/otherviews"));
      fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images_small/" + id + "/otherviews"));
      fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images/" + id + "/files"));
      console.log("创建文件夹完毕");
      //移动otherviews文件
      for (let i = 0; i<otherviews.length; i++) {
        fs.renameSync(
          path.resolve(__dirname, "./www/uploads/" + otherviews[i]),
          path.resolve(__dirname, "./www/images/room_images/" + id + "/otherviews/" + otherviews[i])
        );
        // 改变为小图
        gm(path.resolve(__dirname, "./www/images/room_images/" + id + "/otherviews/" + otherviews[i]))
          .resize(180, 135)
          .write(path.resolve(__dirname, "./www/images/room_images_small/" + id + "/otherviews/" + otherviews[i]), function (err) {
            if (err) {
              console.log(err);
            }
          });
      }
      console.log("移动otherviews文件完毕");
      //移动files文件
      // for (let i = 0; i<files.length; i++) {
      //   fs.renameSync(
      //     path.resolve(__dirname, "./www/uploads/" + files[i].realpath),
      //     path.resolve(__dirname, "./www/images/room_images/" + id + "/files/" + files[i].realpath)
      //   );
      // }
      
      //创建rooms文件夹
      for (let i = 0; i<roomAmount; i++) {
        fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images/" + id + "/" + rooms[i].path));
        fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images_small/" + id + "/" + rooms[i].path));
        //移动rooms图片文件
        for (let j = 0; j<rooms[i].images.length; j++) {
          fs.renameSync(
            path.resolve(__dirname, "./www/uploads/" + rooms[i].images[j]),
            path.resolve(__dirname, "./www/images/room_images/" + id + "/" + rooms[i].path + "/" + rooms[i].images[j])
          );
          //改变为小图
          gm(path.resolve(__dirname, "./www/images/room_images/" + id + "/" + rooms[i].path + "/" + rooms[i].images[j]))
            .resize(180, 135)
            .write(path.resolve(__dirname, "./www/images/room_images_small/" + id + "/" + rooms[i].path + "/" + rooms[i].images[j]), function (err) {
              if (err) {
                console.log(err);
              }
            });
        }
      }
      
      let obj = {
        id,
        area,
        areadetail,
        subway,
        station,
        estate,
        owner,
        roomAmount,
        price,
        floorspace,
        floor,
        heating,
        orientation,
        intelligentlock,
        nearsubway,
        updatedate,
        rooms,
        otherviews,
        files,
        ischecked,
        stars
      };
      
      //由mongoose创建房子：
      House.create(obj, function () {
        console.log("创建房子" + id + "成功");
        res.send("ok");
      });
    });
  });
});

const setfolder = function (temppath, bool) {
  console.log("setfolder" + temppath);
  let tempfiles = [];
  if (fs.existsSync(temppath)) {
    tempfiles = fs.readdirSync(temppath);
    tempfiles.forEach(function (file, index) {
      let curPath = temppath + "/" + file;
      // delete file
      fs.unlinkSync(curPath);
    });
    //如果bool为true，则删除文件夹；为false的话只清空文件夹
    if (bool) {
      fs.rmdirSync(temppath);
    }
  }
};
//更改房子信息
app.post("/updatehouse", function (req, res) {
  let form = new formidable.IncomingForm();
  form.parse(req, function (err, {nowid, step1, step2, step3}, _files) {
    let {
      areaanddetail, subwayandstation, estate, owner, roomAmount, price,
      floorspace, floor, heating, orientation, intelligentlock, nearsubway, updatedate
    } = step1;
    let area = areaanddetail[0];
    let areadetail = areaanddetail[1];
    let subway = [];
    let station = subwayandstation[1];
    for (let k in subway_const) {
      if (subway_const[k].includes(station)) {
        subway.push(k);
      }
    }
    intelligentlock = intelligentlock == "是" ? true : false;
    nearsubway = nearsubway == "是" ? true : false;
    let {rooms, otherviews} = step2;
    let {files} = step3;
    // console.log(nowid, step1 , step2 , step3);
    
    House.find({"id": nowid}).exec((err, results) => {
      let _resroomAmount = results[0].roomAmount;
      
      //如果原来的文件夹个数大于更改后的文件夹
      if (_resroomAmount>roomAmount) {
        console.log("_resroomAmount > roomAmount");
        //step1：删除多余文件夹
        for (let i = _resroomAmount; i>roomAmount; i--) {
          let roompath = results[0].rooms[i - 1].path;
          let temppath = path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath);
          let temppath_small = path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath);
          setfolder(temppath, true);
          setfolder(temppath_small, true);
        }
        //step1：更改文件夹
        for (let j = 0; j<roomAmount; j++) {
          let roompath = rooms[j].path;
          let temppath = path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath);
          let temppath_small = path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath);
          setfolder(temppath, false);
          setfolder(temppath_small, false);
          //移动文件
          for (let m = 0, length1 = rooms[j].images.length; m<length1; m++) {
            let tempfilename = rooms[j].images[m];
            fs.renameSync(
              path.resolve(__dirname, "./www/uploads/" + tempfilename),
              path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath + "/" + tempfilename)
            );
          }
          for (let m = 0, length1 = rooms[j].images.length; m<length1; m++) {
            let tempfilename = rooms[j].images[m];
            //改变为小图
            gm(path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath + "/" + tempfilename))
              .resize(180, 135)
              .write(path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath + "/" + tempfilename), function () {
              });
          }
        }
      } else if (_resroomAmount<roomAmount) {//如果原来的文件夹个数小于更改后的文件夹
        console.log("_resroomAmount < roomAmount");
        //step1：更改文件夹
        for (let j = 0; j<_resroomAmount; j++) {
          let roompath = rooms[j].path;
          let temppath = path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath);
          let temppath_small = path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath);
          setfolder(temppath, false);
          setfolder(temppath_small, false);
          //移动文件
          for (let m = 0, length1 = rooms[j].images.length; m<length1; m++) {
            let tempfilename = rooms[j].images[m];
            console.log(tempfilename + nowid);
            console.log(roompath);
            fs.renameSync(
              path.resolve(__dirname, "./www/uploads/" + tempfilename),
              path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath + "/" + tempfilename),
              function (err) {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('移动文件成功');
              }
            );
          }
          // 改变为小图
          for (let m = 0, length1 = rooms[j].images.length; m<length1; m++) {
            let tempfilename = rooms[j].images[m];
            gm(path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath + "/" + tempfilename))
              .resize(180, 135)
              .write(path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath + "/" + tempfilename), function () {
              });
          }
        }
        //step2：创建剩下的文件夹
        for (let i = _resroomAmount; i<roomAmount; i++) {
          let roompath = rooms[i].path;
          fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath));
          fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath));
          //移动文件
          for (let m = 0, length1 = rooms[i].images.length; m<length1; m++) {
            let tempfilename = rooms[i].images[m];
            console.log(tempfilename);
            fs.renameSync(
              path.resolve(__dirname, "./www/uploads/" + tempfilename),
              path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath + "/" + tempfilename),
              function (err) {
                if (err) {
                  console.log(err);
                  return;
                }
                console.log('移动文件成功');
              }
            );
          }
          // 改变为小图
          for (let m = 0, length1 = rooms[i].images.length; m<length1; m++) {
            let tempfilename = rooms[i].images[m];
            gm(path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath + "/" + tempfilename))
              .resize(180, 135)
              .write(path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath + "/" + tempfilename), function () {
              });
          }
        }
      } else if (_resroomAmount == roomAmount) {//如果原来的文件夹个数等于更改后的文件夹
        //原来的文件夹个数等于更改后的文件夹个数
        console.log("_resroomAmount == roomAmount");
        //step1：更改文件夹
        for (let j = 0; j<_resroomAmount; j++) {
          let roompath = rooms[j].path;
          let temppath = path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath);
          let temppath_small = path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath);
          setfolder(temppath, false);
          setfolder(temppath_small, false);
          //移动文件
          for (let m = 0, length1 = rooms[j].images.length; m<length1; m++) {
            let tempfilename = rooms[j].images[m];
            fs.renameSync(
              path.resolve(__dirname, "./www/uploads/" + tempfilename),
              path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath + "/" + tempfilename)
            );
          }
          //改变为小图
          for (let m = 0, length1 = rooms[j].images.length; m<length1; m++) {
            let tempfilename = rooms[j].images[m];
            //改变为小图
            gm(path.resolve(__dirname, "./www/images/room_images/" + nowid + "/" + roompath + "/" + tempfilename))
              .resize(180, 135)
              .write(path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/" + roompath + "/" + tempfilename), function () {
              });
          }
        }
      }
      console.log("otherviews");
      //更改otherviews文件夹
      let temppath = path.resolve(__dirname, "./www/images/room_images/" + nowid + "/otherviews");
      let temppath_small = path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/otherviews");
      setfolder(temppath, false);
      setfolder(temppath_small, false);
      //移动文件
      for (let m = 0, length2 = otherviews.length; m<length2; m++) {
        let tempfilename = otherviews[m];
        fs.renameSync(
          path.resolve(__dirname, "./www/uploads/" + tempfilename),
          path.resolve(__dirname, "./www/images/room_images/" + nowid + "/otherviews/" + tempfilename)
        );
      }
      for (let m = 0, length2 = otherviews.length; m<length2; m++) {
        let tempfilename = otherviews[m];
        //改变为小图
        gm(path.resolve(__dirname, "./www/images/room_images/" + nowid + "/otherviews/" + tempfilename))
          .resize(180, 135)
          .write(path.resolve(__dirname, "./www/images/room_images_small/" + nowid + "/otherviews/" + tempfilename), function () {
          });
      }
      // if(!!results[0].files.length){
      //   //更改files文件夹
      //   let temppathfile = path.resolve(__dirname, "./www/images/room_images/" + nowid + "/files");
      //   setfolder(temppathfile, false);
      //   //移动文件
      //   for (let n = 0, length3 = files.length; n<length3; n++) {
      //     let temprealpathname = files[n].realpath;
      //     let tempfilename = files[n].changedfilename;
      //     fs.renameSync(
      //       path.resolve(__dirname, "./www/uploads/" + temprealpathname),
      //       path.resolve(__dirname, "./www/images/room_images/" + nowid + "/files/" + tempfilename)
      //     );
      //   }
      // }else{
      //   fs.mkdirSync(path.resolve(__dirname, "./www/images/room_images/" + nowid + "/files"));        
      // }
      let obj = {
        area,
        areadetail,
        subway,
        station,
        estate,
        owner,
        roomAmount,
        price,
        floorspace,
        floor,
        heating,
        orientation,
        intelligentlock,
        nearsubway,
        updatedate,
        rooms,
        otherviews,
        files
      };
      //最终更改数据库中房源的信息：
      House.update({"id": nowid}, {"$set": obj}).exec((err) => {
        if (err) throw err;
        res.send("更改" + nowid + "所有信息成功");
      });
    });
  });
});

//监听端口
app.listen(3500, (err) => {
  if (!err) {
    console.log("run at 3500 port");
  }
});