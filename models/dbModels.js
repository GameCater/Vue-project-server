const db = require("mongoose")
db.Promise = global.Promise
db.connect("mongodb://localhost:27017/wnweb65", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function(err, res) {
    if (err) throw err
    console.log("数据库连接成功")
})
let schema = db.Schema,
    user = new schema({ //用户表
        name: String, //用户名
        nickname: String, //昵称
        age: Number, //年龄
        pwd: String, //密码
        image: String, //头像
        card: String, //身份证
        gender: { type: Number, default: 0 }, //0 未知 1男 2 女
        openid: { type: String, default: "0" }, //小程序用户
        email: String, //邮箱
        state: { type: Number, default: 1 }, //0 禁止 1 正常 2 vip 3 认证用户 4超级管理员
    }),
    movies = new schema({ //电影表
        title: String, //电影名称
        link: String, //官方链接
        image: String, //图片地址
        rating: Number, //评分
        judge: Number, //评价人数
        brief: String, //简介
        actor: String, //演员
        pbtime: Number, //发布时间
        category: { type: Number, default: 0 }, //类别
        startDate: Number, //上映时间  
        language: String, //(国语/粤语/英语...)
        areaName: String, //中国,日本，美国，英国，...
        timeCount: { type: Number, default: 60 }, //分钟 播放时间  120分钟 
        state: { type: Number, default: 1 }, //状态 1: 上线 0: 禁用 2 推荐 
    }),
    cinema = new schema({ //影院表
        brandName: String, //影院表名称(万达影院，大地影院)
        brandlogo: String, //每个牌子的图片
        cinemaAddress: String, //详细地址(xxx路xxx号xxx)
        cinemaPhone: String, // 影院的联系电话
    }),
    session = new schema({ //场次表 
        money: Number, //金额 
        mid: String, // 电影编号 movie _id
        cid: String, // 影院表编号 cinema _id
        startTime: Number, //5: 00
        state: { type: Number, default: 1 }, //状态 1: 上线 0: 下架
    }),
    order = new schema({ //订单明细表 _id 电影编号
        uid: String, //用户编号
        cid: String, //电影号
        sid: String, //场次编号
        orderTime: Number, // 下订单的时间
        state: { type: Number, default: 0 }, // 订单状态(0 未支付 1 已付款)
    }),
    //over
    message = new schema({
        uid: String, //用户ID
        mid: String, //电影ID
        title: String, //标题
        container: String, //简介
        pbtime: Number, //发布时间
        category: Number, //类别
        state: { type: Number, default: 1 } //状态 1: 正常使用 0: 禁用
    }),
    news = new schema({  //电影资讯
        title: String, //标题
        thumb: String,  //海报图片
        intro: String,  //简介
        keywords: String,  //关键字
        author: String,   //作者
        fpTime: Number,   //发布时间
        content: String,   //内容
        state: { type: Number, default: 1 } //状态 1: 正常使用 0: 禁用
    }),
    cate = new schema({  //栏目
        name: String,  //栏目名称
        parentId: { type: String, default: "0" }  //栏目
    }),
    role = new schema({  //角色
        auther: String,  //用户
        path: String,    //地址
    }),
    imgs = new schema({  //上传图片
        url: String,     //图片地址
        date: String,   //上传时间
    }),
    userTable = db.model("user", user, "userinfo"),
    cateTable = db.model("cate", cate, "cateinfo"),
    newsTable = db.model("news", news, "newsinfo"),
    moviesTable = db.model("movies", movies, "moviesinfo"),
    cinemaTable= db.model("cinema", cinema, "cinemainfo"),
    sessionTable=db.model("session",session,"sessioninfo"),
    orderTable=db.model("order",order,"orderinfo"),
    roleTable = db.model("role", role, "roleinfo"),
    messageTable = db.model("message", message, "messageinfo"),
    imgsTable = db.model("imgs", imgs, "imgsinfo");

module.exports = { userTable, newsTable, cateTable, 
    roleTable, imgsTable, moviesTable, messageTable,cinemaTable,sessionTable,orderTable}