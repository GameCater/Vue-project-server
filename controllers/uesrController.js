const M = require("./MController");
const TB="userTable";

class userController {
    async test(req,res){
        try{
            let data=await M.GetOne(TB)
            res.json({status:true,data,tb:TB})
        }catch (err) {
            res.json({status:false,data:err})
        }
    }
}
module.exports =userController;