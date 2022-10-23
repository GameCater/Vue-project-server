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
}
module.exports =userController;