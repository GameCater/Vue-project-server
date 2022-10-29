const express = require('express');
const uploader = require("../utils/upload.config.js");

/*路由控制器*/
const routeController = require("../controllers/routeController");
const RC = new routeController();

/*
* 电影控制器
* */
const movieController = require("../controllers/movieController");
const MC=new movieController();
/*
* 用户控制器
* */
const userController=require("../controllers/uesrController")
const UC=new userController();

/*场次控制器*/
const sessionController=require("../controllers/sessionController")
const SC=new sessionController();

const cinemaController=require("../controllers/cinemaController")
const CC=new cinemaController();

const orderController=require("../controllers/orderController")
const OC=new orderController();



/*接口路由表*/
const router = express.Router();
router.get('/', (req, res, next) => res.json({ info: "root" }))
    .post("/login", RC.Login)
    .get("/loginout", RC.loginOut)
    .get("/getUserInfo", RC.getUserInfo)
    .get("/getuserData", RC.getuserData)
    .post("/updateUserInfo", UC.updateUser)
    .post("/loginCheck", RC.loginCheck)
    .post("/adduserdata", RC.addUserData)
    .post("/upload", uploader.single('img'), RC.upload)
    .get("/initMovie", RC.initMovie)
    .get("/getmovie", RC.getMovie)
    .get("/getMovieDetail", MC.getMovieDetail)
    .get("/searchMovie", RC.searchMove)
    .get("/deleteMovie", MC.deleteOne)
    .post("/updateMovie", MC.updateOne)
    .get("/gettop", RC.gettop)
    .get("/getcinema", RC.getCinema)
    .get("/initCinemas", CC.initCinemas)
    .get("/searchCinemas", CC.searchCinemas)
    .get("/getsession", RC.getSession)
    .get("/getorder", RC.getOrder)
    .get("/movieoptions", RC.movieOptions)
    .get("/cinemaoptions", RC.cinemaOptions)
    .get("/getShow", RC.getShow)
    .get("/searchMove", RC.searchMove)
    .post("/wxlogin", RC.wxlogin)
    .post("/getCharts",RC.getCharts)
    .get("/randmovie", RC.randMovie)
    .get("/getcate", MC.getcate)
    .get("/testuc",UC.test)
    .get("/searchSession",SC.searchSession)
    .get("/searchMoviesLess", MC.searchMoviesLess)
    .post("/createSession", SC.createSession)
    .get("/deleteSession", SC.deleteSession)
    .get("/querySessions", SC.querySessions)
    .get("/getSessionsByMid", SC.getSessionsByMid)
    .get("/generateOrder", OC.generateOrder)
    .get("/getOrderDetail", OC.getOrderDetail)


module.exports = router;