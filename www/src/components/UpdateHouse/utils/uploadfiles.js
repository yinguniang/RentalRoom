//传入的两个回调函数分别表示上传成功之后做什么、上传进度
export default (file, callback1, callback2, url) => {
  //一个一个传
  //使用“小黄人”2.0对象。
  let xhr = new XMLHttpRequest();
  //组件表单数据，只有表单数据能够被提交
  let fd = new FormData();
  //表单的数据都是pics的name，因为我们这个时候只需要完成上传即可
  fd.append("file", file);
  //上传的进度
  xhr.upload.onprogress = callback2;  //代理
  //回调函数
  xhr.onload = function () {
    callback1(xhr.responseText);
  };
  
  //发出请求
  xhr.open("POST", url, true);
  xhr.send(fd);
};