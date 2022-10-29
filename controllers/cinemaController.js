const M = require("./MController");
const TB = "sessionTable";
//使用 Aggregate 查询_id 如果要转换数据类型时使用
const {Types} = require("mongoose");
const {ObjectId} = Types;


class cinemaController {
    async updatecinema(req, res) {
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

    async initCinemas(req, res) {
        let datas = require("../initjson/cinema.json");
        const data = await M.InsertMany("cinemaTable", datas);
        res.json({data, status: true})
    }

    async searchCinemas(req, res) {
        try {
            const { word } = req.query;
            const result = await M.GetRow("cinemaTable", { brandName: { $regex: word } }, {});
            res.json({ status: true, data: result });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = cinemaController;