const M = require("./MController");
const TB="userTable";
const md5 = require('md5');

class userController {
    async test(req,res){
        try{
            let data=await M.GetOne(TB)
            res.json({status:true,data,tb:TB})
        }catch (err) {
            res.json({status:false,data:err})
        }
    }

    async updateUser(req, res) {
        try {
            const { user } = req.body;
            const { _id, pwd } = user;
            console.log(pwd);
            if (pwd) {
                user.pwd = md5(md5(pwd));
            }
            delete user._id;
            delete user.state;
            const { modifiedCount } = await M.Update(TB, { _id }, user);
            if (modifiedCount) {
                res.send({ status: true });
            } else {
                res.send({ status: false })
            }
        } catch (error) {
            console.log(error);
        }
    }

    // 用户统计
    async getUserCharts(req, res) {
        try {
            const piple = [
                {
                    $group: {
                        _id: "$state",
                        state: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                },
            ]
            let data = await M.Aggregate(TB, piple);  //管道 聚合 查询
            console.log("管道 聚合 查询",data);
            data = data.reduce((a, b) => a.push(b.state) && a, [])
            res.json({data, status: true})

        } catch (e) {
            res.json({e: e.message, status: false})
        }
    }

    // 搜索用户
    async searchUser(req, res) {
        console.log(req.query)
        try {
            let word = req.query.word,
                page = req.query.page * 1 ||1,
                pageSize = req.query.pageSize * 1||10;

            /* const data = await M.GetRow("moviesTable", {title: {$regex: word}}, {
                 _id: 1,
                 image: 1,
                 title: 1,
                 rating: 1
             });*/

            let start = (page - 1) * pageSize;

            console.log(word, page, pageSize, start);

            const data = await M.Page("userTable", {__v: 0}, {name: {$regex: word}}, {}, pageSize, start); //分页
            const count = await M.Total("userTable", {name: {$regex: word}}); //总数据
            const maxPage = Math.ceil(count / pageSize)
            res.json({count, data, maxPage, status: true})

        } catch (e) {
            res.json({e: e.message, status: false})
        }

    }

    async delOneUser(req, res) {
        let _id = req.query.id;
        let {deletedCount:data} = await M.Del("userTable",{_id})
        res.json(data == 1 ? {status:true,data}:{status:false})
    }

    // 根据id搜索用户信息
    async findById(req,res){
        try{
            let _id = req.query.id;
            let data=await M.GetOne("userTable",{_id})
            console.log(data);
            res.json({status:true,data})
        }catch (err) {
            res.json({status:false,data:err})
        }
    }

    // 新增用户
    async addUser(req, res) {
        try {
            req.body.pwd = md5(md5(md5(req.body.pwd)));
            req.body.state = 1 // 默认普通用户
            if (!req.body.name && !req.body.nickname)
                req.body.name = req.body.nickname = '普通用户_' + Date.now(); // 默认用户名和昵称
            const data = await M.Create("userTable", req.body); //保存
            res.json({data, status: true})
        } catch (e) {
            console.log(e);
            res.json({e: e.message, status: false})
        }
    }

    // 后台更新用户信息
    async updateUserInfo(req, res) {
        try {
            const data = req.body;
            const user = await M.GetOne(TB, { _id: data._id });
            console.log(data, user);
            if (user.pwd !== data.pwd) {
                data.pwd = md5(md5(md5(data.pwd)));
            }
            const { modifiedCount } = await M.Update(TB, { _id: data._id }, data);
            res.json(modifiedCount > 0 ? { status: true } : { status: false });
        } catch (error) {
            console.log(error);            
        }
    }
}
module.exports =userController;