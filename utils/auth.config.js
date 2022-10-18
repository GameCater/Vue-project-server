const { expressjwt: jwt } = require("express-jwt");
const TOKEN_SECRET = "shuke";
const jwtAuth = jwt({
    secret: TOKEN_SECRET, //用相同的密钥来讲token解析出来
    algorithms: ["HS256"], //设置JWT的加密算法
    credentialsRequired: false,
    // false:对于没有token的请求就不进行校验
    // true：不管有没有token都要进行校验，没有token直接失败
}).unless({
    // 配置不需要校验的地址。配置白名单
    path: [ {
        url: /^\/api\/(login|logincheck|getmovie|searchMove|upload|adduserdata|randMovie|gettop12|getcate|wxlogin|testuc|updatecinema|searchSession)/i,
        methods: ["GET", "POST"]

    },{
        url:/^\/testapi/i,
        methods:["GET","POST"]
    }],

})
module.exports = { jwtAuth };