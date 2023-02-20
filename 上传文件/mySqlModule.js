// 这是我自己封装的数据库操作模块

// 导出数据库操作模块
var mysql = require("mysql")
// 定义数据库连接信息
var infoObj = {
    host: "localhost",  // 数据库服务地址, localhost是本地服务
    port: 3306, // mysql数据库服务端口号, 默认3306 
    user: "root",  // 服务账号
    password: "root" , // 服务密码
    database: "h5-77"  // 数据库名
}
// 验证服务器能否连接
var sqlObj = mysql.createConnection(infoObj)
sqlObj.connect(function(err){
    if(err) console.log("数据库链接失败", err.message)
    else console.log("数据库链接成功")
    sqlObj.end();
})
// 创建数据库操作函数
function action(sqlString, res, callback=null){
    var sqlObj = mysql.createConnection(infoObj)
    sqlObj.connect(function(err){
        if(err){
            console.log(err.message)
            res.json({code:0, data: "服务器错误,请重试"})
            return;
        }
        sqlObj.query(sqlString, function(err, data){
            if(err) {
                console.log(err.message)
                res.json({code:0, data: "服务器错误,请重试"})
            } 
            else{
                if(callback){
                    // 只有查询操作传入了这个回调函数, 不为空说明是查询操作
                    callback(data)
                    // res.json({code: 1, data})
                }else{
                    res.json({code:1, data: "操作成功"})
                }
            } 
        })
        sqlObj.end();
    })
}

// 导出操作函数
module.exports = action;