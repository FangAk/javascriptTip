var express = require("express")
var bodyParser = require("body-parser")
var multer = require("multer")
var app = express();
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }))
app.listen(5000, function () {
    console.log("服务器已启动, 访问5000端口")
})
const path = require('path');
const fs = require('fs');
//设置跨域访问
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
// //orcal
// const oracledb = require('oracledb');
// //连接数据库
// oracledb.getConnection({
//     user: "KSSW_DATA",
//     password: "KSSW_DATA",
//     connectString: "C:/Users/Akk/Documents/Navicat/Oracle/Servers/SERVICE_NAME/KSSW_DATA"
// }, function (err, connection) {
//     if (err) {
//         console.log(err.message);
//         return;
//     }
//     console.log("数据库连接成功");
//     connection.close(function (err) {
//         if (err) {
//             console.log(err.message);
//             return;
//         }
//         console.log("数据库连接已关闭");
//     });
// });

//连接pgsql
const pgOpt = require('pg');
const pg = {
    user: 'postgres',
    password: 'postgres',
    host: '153.101.160.58',
    port: '16043',
    database: 'SCSW_DATA',

};
var pgPool = new pgOpt.Pool(pg);
pgPool.connect(function (err) {
    if (err) {
        return console.error('数据库连接出错', err);
    }
    return console.log('plsql数据库连接成功')
})


// 查询
app.post('/scquery', function (req, res) {
    //获取reqt中的参数
    var name = req.body.sql;
    console.log(req.body);
    console.log(name);
    if (name) {
        pgPool.query("select * from jc_alarm_info " + name + "", function (err, result) {
            if (err) {
                return result.send(err);
            }
            result.rows.map((v) => {
                v.recordtime = v.recordtime.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
                v.uploadtime = v.uploadtime.toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
            })
            return res.send(result.rows);

        });
    } else {
        return res.send('参数错误');
    }

})



// 查询
app.post('/schistory', function (req, res) {
    pgPool.query("select * from jc_jg_history", function (err, result) {
        if (err) {
            return console.error('查询出错', err);
        }
        return res.send(result.rows);

    });
})




app.post("/query1", function (req, res) {
    res.send([
        {
            id: 1,
            name: "张三",
            age: 18,

        }
    ])

})

//查询
app.post('/query2', function (req, res) {
    pgPool.query("select * from jc_ll_flow_day ", function (err, result) {
        if (err) {
            return console.error('查询出错', err);
        }
        return res.send(result.rows);

    });
})
//查询调度流向

//导入
const upload = express.Router()
var Multer = multer({ dest: './public/imgs' }); //设置上传的的文件保存目录
// 表示接收任何上传的数据 对应的有个 upload.single('user') 表示只接收name为user的上传数据
app.use(Multer.any());
app.post('/images', (req, res) => {
    console.log(req)
    // 带后缀的路径
    const newpath = req.files[0].path + path.parse(req.files[0].originalname).ext
    // 带后缀的文件名
    const newname = req.files[0].filename + path.parse(req.files[0].originalname).ext
    // 重命名文件名
    fs.rename(req.files[0].path, newpath, err => {
        if (err) return res.send({
            "data": null,
            "meta": {
                "msg": "文件上传失败！",
                "status": 400
            }
        })
    })
    res.send({
        "data": newname,
        "meta": {
            "msg": "文件上传成功！",
            "status": 200
        }
    })
})

//下载文件
app.get('/download', function (req, res) {
    var file = './public/imgs/' + req.query.filename;
    res.download(file); // Set disposition and send it.
});

module.exports = upload

