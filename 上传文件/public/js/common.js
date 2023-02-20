// 这个文件放各页面公用的逻辑

//注意：导航 依赖 element 模块，否则无法进行功能性操作
layui.use('element');

// 读取登录信息
var account = sessionStorage.getItem("account")
