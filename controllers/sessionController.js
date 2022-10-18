const M = require("./MController");
const TB = "sessionTable";
//使用 Aggregate 查询_id 如果要转换数据类型时使用
const {Types} = require("mongoose");
const {ObjectId} = Types;


class sessionController {
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


                        cid: 0,
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
}

module.exports = sessionController;