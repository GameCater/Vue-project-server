const M = require("./MController");
const TB = "sessionTable";
//使用 Aggregate 查询_id 如果要转换数据类型时使用
const {Types} = require("mongoose");
const {ObjectId} = Types;


class sessionController {
    // 根据id查询场次详情
    async searchSession(req, res) {
        try {
            const {id}=req.query;
            const piple = [
                {
                    $match: {_id: ObjectId(id)}
                },
                {
                    $project: {
                        _id: "$_id",
                        money: "$money",
                        mid: {
                            $toObjectId: "$mid"
                        }

                        ,
                        cid: {
                            $toObjectId: "$cid"
                        },
                        startTime: "$startTime",
                        state: "$state"
                    }
                },
                {

                    $lookup: {
                        from: "moviesinfo",
                        localField: "mid",
                        foreignField: "_id",
                        as: "movies"
                    }
                },
                {

                    $lookup: {
                        from: "cinemainfo",
                        localField: "cid",
                        foreignField: "_id",
                        as: "cinema"
                    },

                },
                {
                    $project: {
                        __v: 0
                    }
                }

            ];
            const data = await M.Aggregate(TB, piple)
            res.json({data, status: true})
        } catch (message) {
            res.json({message, status: false})
        }

    }

    // 新增场次信息
    async createSession(req, res) {
        try {
            const { data } = req.body;
            const result = await M.Create(TB, data);
            res.json({ status: true, data: result });
        } catch (error) {
            console.log(error);
        }
    }

    async deleteSession(req, res) {
        try {
            const { id } = req.query;
            const result = await M.Del(TB, { _id: id });
            res.json({ status: true });
        } catch (error) {
            console.log(error);
        }
    }

    // 场次模糊查询
    async querySessions(req, res) {
        try {
            const { word } = req.query;
            console.log('word', word);
            const result = await M.Aggregate(TB, [
                {  
                    $project: {
                        _id: "$_id",
                        mid: { $toObjectId: "$mid" },
                        cid: { $toObjectId: "$cid" }
                    }
                },
                {
                    $lookup: {
                        from: "moviesinfo",
                        localField: "mid",
                        foreignField: "_id",
                        as: "movies"
                    }
                },
                {
                    $lookup: {
                        from: "cinemainfo",
                        localField: "cid",
                        foreignField: "_id",
                        as: "cinema"
                    },

                },
                {
                    $match: {
                        $or: [{ 'movies.title': { $regex: word  } }, { 'cinema.brandName': { $regex: word } }],
                    }
                }
            ]);
            res.json({ result });
        } catch (error) {
            console.log(error);
        }
    }

    // 根据电影id查询场次
    async getSessionsByMid(req, res) {
        // 默认第一页 20条数据
        const { id, page = 1, pageSize = 20 } = req.query;
        
        const pipe = [
            { // 匹配mid字符串
                $match: {
                    "mid": id
                }
            },
            {
                $project: { 
                    _id: "$_id",
                    mid: { $toObjectId: "$mid" },
                    cid: { $toObjectId: "$cid" },
                    money: 1,
                    startTime: 1,
                    state: 1
                }
            },
            {
                $lookup: { // 联电影表
                    from: "moviesinfo",
                    localField: "mid",
                    foreignField: "_id",
                    as: "movies"
                }
            },
            {
                $lookup: { // 联影院表
                    from: "cinemainfo",
                    localField: "cid",
                    foreignField: "_id",
                    as: "cinema"
                }
            },
            {
                $skip: (page * 1 - 1) * pageSize * 1
            }, 
            {
                $limit: pageSize * 1,
            }
            
        ];

        const results = await M.Aggregate(TB, pipe);
        console.log(results);
        const total = await M.Total(TB, { mid: id });
        const maxPage = Math.ceil(total / pageSize);
        res.json({results, total, maxPage});
    }
}

module.exports = sessionController;