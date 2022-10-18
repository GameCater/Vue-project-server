const M = require("./MController");
const TB="moviesTable";

class movieController {

    async getcate(req,res){
        try{
            let cate=Number(req.query.cate)
            const data=await M.GetRow(TB,{category:cate},{
                title:1,
                image:1,
                rating:1,
                pbtime:1,
                category:1
            })
            res.json({status:true,data})

        }catch (err) {
            res.json({status:false,message:err.message})
        }
    }

    async deleteOne(req, res) {
        try {
            const { id } = req.query;
            const { deletedCount } = await M.Del(TB, { _id: id });
            if (deletedCount) {
                res.json({ status: true });
            }
        } catch (error) {
            res.json({ status: false });
        }
    }

    async updateOne(req, res) {
        try {
            const { body:data } = req;
            const { _id } = data;
            delete data._id;
            const { modifiedCount } = await M.Update(TB, { _id }, data);
            if (modifiedCount) {
                res.json({ status: true });
            } else {
                res.json({ status: false, reason: '数据库操作失败' });
            }
        } catch (error) {
            res.json({ status: false, reason: error.message });
        }
    }

    async getMovieDetail(req, res) {
        try {
            const { id } = req.query;
            const data = await M.GetOne(TB, { _id: id });
            if (data !== null) {
                res.json({ status: true, data });
            } else {
                res.json({ status: false, reason: '数据库查询失败' });
            }
        } catch (error) {
            res.json({ status: false, reason: error.message });
        }
    }
}
module.exports = movieController;