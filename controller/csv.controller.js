import Csv from '../model/csv.model';
import path from 'path';
import csv from 'fast-csv';
import fs from 'fs';
// import {fileURLToPath} from 'url';

const importCsv = async(req ,res)=>{

    console.log(req.file);
    const totalRecords = [];
    console.log("==========" ,totalRecords)
  try{
    const filePath = path.join(_dirname,'../', req.file.filename);

    fs.createReadStream(filePath)
      .pipe(csv.parse({headers:true}))
      .on('error',error=>console.error(error))
      .on('data',row=>totalRecords.push(row))
      .on('end', async () => {
        try{
            const users = await Csv.insertMany(totalRecords);
            res,status(200).json (users);
            console.log(users);
          }catch(error){
            res.status(400).json(err);
          }
      });
     
}catch(error){
    res.status(400).json(error)
}
};

export default importCsv;