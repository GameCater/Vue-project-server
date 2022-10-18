const multer = require("multer");
const path = require("path");
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../www/upload"))
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
let uploader = multer({ storage }); //文件上传配置
module.exports = uploader;