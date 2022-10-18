const express = require("express");
const path = require("path");
const bodyParser = require("body-parser"); //中间件
const apiRouter = require("./routes/apiRouter");
const {jwtAuth} = require("./utils/auth.config");

//express 实例化
app = express();
app.use(bodyParser.urlencoded({extended: false})); //路由解码
app.use(bodyParser.json()); //实例使用中间件

app.use(express.static(path.join(__dirname, "www"))) //功能:用户可直接访问

//跨域(协议,域名,端口号)
app.all("*", function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "content-type,Token");
    //跨域允许的请求方式 
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    //指定本次预检请求的有效期，单位秒，在此期间不用发出另一条预检请求。
    res.setHeader("Access-Control-Max-Age", "3600");
    next();
});

//token 验证处理err
app.use(jwtAuth, (err, req, res, next) => {
    try {
        if (err) {
            return res.json({
                message: err,
                status: false
            });
        } else {
            next()
        }
    } catch (e) {
        return res.json({
            message: e,
            status: false
        });
    }
})

app.use("/api", apiRouter)
    .use((req, res) => { //错误重定向 res.redirect(404,"back")
        try {
            res.json({
                message: "这个接口没有找到",
                status: false
            });
        } catch (e) {
            return res.json({
                message: e.message,
                status: false
            });
        }

    })
    .listen(6600, "0.0.0.0", function (err, res) {
        if (err) throw err
        console.log("服务启动 http://localhost:6600")
    });