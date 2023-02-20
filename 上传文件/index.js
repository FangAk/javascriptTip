var express = require("express")
var bodyParser = require("body-parser")
var multer = require("multer")
var app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(5000, function () {
    console.log("服务器已启动, 访问5000端口")
})
// 自定义的数据库操作模块
var mysqlAction = require('./mySqlModule')

//设置跨域访问（设置在所有的请求前面即可）
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == 'OPTIONS')
        res.sendStatus(200); //让options尝试请求快速结束
    else
        next();
});
// 登录
app.post("/login", function (req, res) {
    console.log("登录", req.body)
    mysqlAction(`select * from users where account='${req.body.account}' and password='${req.body.password}'`, res, function (data) {
        if (data.length > 0) {
            res.json({ code: 1, data: "登录成功" })
        } else {
            res.json({ code: 0, data: "账号或密码错误" })
        }
    })
})
// 注册
app.post("/register", function (req, res) {
    console.log("注册", req.body.account)
    mysqlAction(`select * from users where account='${req.body.account}'`, res, function (data) {
        if (data.length > 0) {
            res.json({ code: 0, data: "此账号已存在" })
        } else {
            mysqlAction(`insert into users (account,password,phone,sex,age) values ('${req.body.account}','${req.body.password}','${req.body.phone}','${req.body.sex}','${req.body.age}')`, res)
        }
    })
})
// 发布
app.post("/publish", function (req, res) {
    console.log("发布", req.body)
    mysqlAction(`insert into news (name,time,message) values ('${req.body.name}','${req.body.time}','${req.body.message}')`, res)
})
// 评论
app.post("/comment", function (req, res) {
    console.log("评论", req.body.id)
    mysqlAction(`insert into comment (name,time,message,targetId) values ('${req.body.name}','${req.body.time}','${req.body.message}','${req.body.id}')`, res)
})
// 查询
app.get("/getNews", function (req, res) {

    // 先读取所有发布的消息
    mysqlAction(`select * from news order by id desc`, res, function (newsList) {
        console.log("news", newsList.length)
        // 再读取所有评论 
        mysqlAction(`select * from comment`, res, function (commentList) {
            console.log("comment", commentList.length)
            res.json({
                code: 1,
                data: {
                    news: newsList,
                    comments: commentList
                }
            })
        })
    })

    //Error:  Cannot set headers after they are sent to the client
    //报错: 服务器在返回给客户端响应后不能再次设置响应头, 当一个接口向一次客户端请求返回多次响应时报错
})

// 头像上传功能
var save = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, "./public/imgs/headImg")
        },
        filename: function (req, file, callback) {
            // 在文件存储时, bodyparser模块还没有解析请求体中的数据,所以req.body是空的
            console.log(req.body, req.headers.name)
            // 把头像名设置为用户名,保证一个用户对应一张头像,不冲突, 格式保留原有后缀名
            callback(null, decodeURI(req.headers.name) + ".png")
        }
    })
})
app.post("/uploadImg", save.single("headImg"), function (req, res) {
    console.log(req.body)
    if (req.file) {
        res.json({ code: 1, data: "上传成功" })
    } else {
        res.json({ code: 0, data: "上传失败" })
    }
})


