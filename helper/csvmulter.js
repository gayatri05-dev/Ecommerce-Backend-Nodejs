import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        if(!fs.existsSync("csv")) {
            fs.mkdirSync("csv");
        }

        if(!fs.existsSync("csv/uploads")){
            fs.mkdirSync("csv/uploads");
        }
        cb(null ,"csv/uploads");
    },
    filename: function (req ,file , cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const csvMiddleware = multer({
    storage:storage ,
    fileFilter: function(req, file , cb) {
        var ext = path.extname(file.originalname);

        if(ext !== ".csv"){
            return cb(new Error("Only csvs are allowed!"));

        }
        cb(null , true)
    }
});

export default csvMiddleware;