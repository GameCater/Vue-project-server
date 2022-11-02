const M = require("./MController");
const TB = "orderTable";
//使用 Aggregate 查询_id 如果要转换数据类型时使用
const {Types} = require("mongoose");
const {ObjectId} = Types;

module.exports = class {
  // 生成订单
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
    const record = await M.GetOne(TB, { _id: id });
    console.log(record);
    res.send({ status: true, data: record });
  }

  // 后台获取订单列表
  async getOrderList(req, res) {
    try {
      let { page, pageSize } = req.query;
      page = parseInt(page, 10) || 1;
      pageSize = parseInt(pageSize, 10) || 20;
      const start = (page - 1) * pageSize;
      // const result = await M.Page(TB, {}, {}, {}, pageSize, start);

      const pipes = [
        {
          $skip: start
        },
        {
          $limit: pageSize
        },
        {
          $project: {
            uid: {
              $toObjectId: "$uid",
            },
            sid: {
              $toObjectId: "$sid",
            },
            orderTime: 1,
            state: 1,
          }
        },
        {
          $lookup: {
            from: 'userinfo',
            foreignField: '_id',
            localField: 'uid',
            as: 'users',
          }
        }, 
        {
          $lookup: {
            from: 'sessioninfo',
            foreignField: '_id',
            pipeline: [
              {
                $project: {
                  'cid': {
                    $toObjectId: '$cid',
                  },
                  'mid': {
                    $toObjectId: '$mid'
                  },
                  state: 1,
                  startTime: 1
                }
              },
              {
                $lookup: {
                  from: 'cinemainfo',
                  localField: 'cid',
                  foreignField: '_id',
                  as: 'cinema'
                },
                $lookup: {
                  from: 'moviesinfo',
                  localField: 'mid',
                  foreignField: '_id',
                  as: 'movie'
                },
              }
            ],
            localField: 'sid',
            as: 'sessions',
          }
        },
      ];

      const result = await M.Aggregate(TB, pipes);

      const count = await M.Total(TB),
            maxPage = Math.ceil(count / pageSize);
      res.json({ status: true, data: result, total: count, maxPage });
    } catch (error) {
     console.log(error); 
    }
  }

  // 前台获取用户订单(已过期、未过期)
  async getUserOrders(req, res) {
    try {
      const { id } = req.query;
      const results = await M.GetRow(TB, { uid: id });
      res.json({ status: true, data: results });
    } catch (error) {
      console.log(error);
    }
  }

  // 后台获取用户订单
  async getOrdersGroupByUid(req, res) {
    const pipes = [
      {
        $project: {
          oid: "$_id",
          uid: 1,
          orderTime: 1,
          state: 1,
          sid: 1
        }
      },
      {
        $group: {
          _id: "$uid",
          orders: {
            $push: "$oid"
          }
        }
      },
      {
        $lookup: {
          from: 'orderinfo',
          localField: 'orders',
          foreignField: '_id',
          pipeline: [
            {
              $project: {
                sid: {
                  $toObjectId: "$sid",
                },
                state: 1,
                orderTime: 1
              }
            },
            {
              $lookup: {
                from: 'sessioninfo',
                localField: 'sid',
                foreignField: '_id',
                as: 'session'
              }
            }
          ],
          as: 'orders'
        }
      },
      {
        $project: {
          '_id': {
            $toObjectId: "$_id",
          },
          orders: 1,
        }
      },
      {
        $lookup: {
          from: 'userinfo',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
    ];
    const results = await M.Aggregate(TB, pipes);
    res.json({ results });
  }
}