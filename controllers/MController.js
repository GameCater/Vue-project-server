/**
 * @title 基于数据库操作模块的开发：M 模型
 * @author shuke
 * @date 2020/4/28
 * @Description:  基于 mongodb 的数据库操作类库 Conn.js M.js
 * @Conn.js 用于数据连接操作
 * @method: Total,IsExists,GetRow,GetOne,FetchAll,Update,Create,Del
 */
const db=require("../models/dbModels.js");
class MController {
    /**
     * 返回数据总个数
     * @param tName 表名
     * @param condition 条件
     * @return number
     */
    Total(tname,condition={}){
       return  db[tname].count(condition)
    }
    /**
     * 检查数据是否存在
     * * @return 1存在:0不存在
    **/
    IsExists(tname,condition={}){

        return db[tname].findOne(condition)
    }
    /**
     * 返回多条数据
     * @param string $tName 表名，
     * @param string $condition 条件
     * @param string $fields 返回的字段，默认是*
     * @return cb
     */
    GetRow(tname,condition={},fields={}){
       return db[tname].find(condition,fields)
    }

    /**
     * 返回单个数据
     * @param string $t 表名
     * @param string $condition 条件
     * @param string $field 返回的字段，
     * @return string
     */
    GetOne(tname,condition={},fields={}){
        return db[tname].findOne(condition,fields)
    }
    /**
     * 返回全部数据，返回值为二维数组
     * @param string $tName 表名
     * @param string $fields 返回字段，默认为""
     * @param string $condition 条件
     * @param string $orders 排序
     * @param string $limits 显示个数
     * @return ArrayObject
     */
    FetchAll(tname,condition={},fields={},orders={},limits=10){
       return  db[tname].find(condition,fields).sort(orders).limit(limits)
    }

    /**
     * 分页
     * @param string $tName 表名
     * @param string $fields 返回字段，默认为""
     * @param string $condition 条件
     * @param string $orders 排序
     * @param string $limits 显示个数
     * @param string $skip 跳过
     * @return ArrayObject
     */
    Page(tname,fields={},condition={},orders={},limits=10,skips=0){
        return  db[tname].find(condition,fields).sort(orders).limit(limits).skip(skips)
    }
    /**
     * 数据库修改操作
     * @param    tName 表名 || SQL 语句
     * @param    field 字段数组
     * @param    condition 条件
     * @return   受影响的行数
     */
    Update(tname,condition={},fields={}){
       return db[tname].updateMany(condition,{$set:fields})
    }
    /**
     * 数据库添加操作
     * @param   $tName 表名 || SQL语句
     * @param   $val 值数组
     * @return  受影响的行数
     */
    Create(tname,val={}){
       return db[tname].create(val)
    }
	/**
     * 数据库添加多行操作
     * @param   $tName 表名 || SQL语句
     * @param   $val 值数组
     * @return  受影响的行数
     */
    InsertMany(tname,val={}){
       return db[tname].insertMany(val)
    }
    /**
     * 数据库删除操作（
     * @param   $tName 表名 || SQL 语句
     * @param   $condition 条件
     * @return   受影响的行数
     */
    Del(tname,condition={}){
       return  db[tname].deleteMany(condition)
    }
    /**
     * 数据库管道操作（
     * @param   $tName 表名 || SQL 语句
     * @param   $condition 条件
     * @return   受影响的行数
     */
    Aggregate(tname,piple=[]){
        return  db[tname].aggregate(piple)
    }

}

module.exports=new MController();