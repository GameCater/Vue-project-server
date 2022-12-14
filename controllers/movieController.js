const M = require("./MController");
const TB="moviesTable";

class movieController {

    async searchMoviesLess(req, res) {
        try {
            const { word } = req.query;
            const data = await M.GetRow(TB, { title: { $regex: word } }, {});
            res.json({ status: true, data });
        } catch (error) {
            console.log(error);
        }
    }

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

    // 发现电影 state: 2 pbtime: -1
    async findMovies(req, res) {
        try {
            let { page, pageSize } = req.query;
            page = parseInt(page, 10) || 1,
            pageSize = parseInt(pageSize, 10) || 10;
    
            const results = await M.Page(TB, {}, { state: 2 }, { pbtime: -1 }, pageSize, (page - 1)*page);
            const count = await M.Total(TB, { state: 2 });
            const maxPage = Math.ceil(count / pageSize);
            res.json({ status: true, data: results, total: count, maxPage });
        } catch (error) {
            console.log(error);            
        }
    }

    // 新增电影
    async addMovie(req, res) {
        try {
            const data = req.body;
            data.language = data.language.join(' ');
            const results = await M.Create(TB, data);
            console.log(results);
            res.json({ status: true });
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = movieController;