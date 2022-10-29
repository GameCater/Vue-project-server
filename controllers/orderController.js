const M = require("./MController");
const TB = "orderTable";
//使用 Aggregate 查询_id 如果要转换数据类型时使用
const {Types} = require("mongoose");
const {ObjectId} = Types;

module.exports = class {
  async generateOrder(req, res) {
    try {
      const { uid, sid } = req.query;
  
      const record = {};
      record.state = 0; // 未支付
      record.uid = uid; // 订购的用户
      record.sid = sid; // 用户订购的场次
      record.orderTime = Date.now(); // 订单生成的时间戳
  
      const result = await M.Create(TB, record);
      console.log(result);

      res.send({ status: true, data: result });
    } catch (error) {
      console.log(error);
    }
  }

  // 获取订单详情
  async getOrderDetail(req, res) {
    const { id } = req.query; // 获取订单id
    console.log(id);
    // const pipes = [
    //   {
    //     $match: {
    //       _id: ObjectId(id)
    //     }
    //   },
    //   {
    //     $project: {
    //       _id: '$_id',
    //       uid: {
    //         $toObjectId: "$uid"
    //       },
    //       sid: {
    //         $toObjectId: "$sid"
    //       },
    //       state: 1,
    //       orderTime: 1
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "userinfo",
    //       localField: "uid",
    //       foreignField: "_id",
    //       as: "users"
    //     }
    //   },
    //   {
    //     $lookup: {
    //       from: "sessioninfo",
    //       localField: "sid",
    //       foreignField: "_id",
    //       as: "sessions"
    //     }
    //   },
    //   {
    //     $project: {
    //       orderTime: 1,
    //       state: 1,
    //       "session": { $arrayElemAt: ["$sessions", 0] },
    //       "user": { $arrayElemAt: ["$users", 0] },
    //     }
    //   },
    //   // {
    //   //   $lookup: {
    //   //     from: "cinemainfo",
    //   //     localField: "session.cid",
    //   //     foreignField: "_id",
    //   //     as: "cinema"
    //   //   }
    //   // },
    //   // {
    //   //   $lookup: {
    //   //     from: "movieinfo",
    //   //     localField: "$$session.mid",
    //   //     foreignField: "_id",
    //   //     as: "movie"
    //   //   }
    //   // },
    // ];

    // const record = await M.Aggregate(TB, pipes);
    const record = await M.GetOne(TB, { _id: id });
    console.log(record);
    res.send({ status: true, data: record });
  }
}