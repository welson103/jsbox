exports.viewReady = (sender) => {
  //alert("界面1初始化")
}

exports.ready = (sender) => {
  //alert("按钮1初始化")
}

var app = require("./scripts/app");
var my=require("./scripts/my");

exports.tapped = function(sender) {
  app.sayHello2();
}

//require只是一厢情愿地找到函数库，能否调用函数库的函数，则取决于函数库本身是否用module.exports对外披露api接口

//函数库已经对外披露api接口的，使用exports定义，将外部函数定义为本地函数
