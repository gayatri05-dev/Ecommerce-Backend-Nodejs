import express from "express";
const router = express.Router();
import csvMiddleware from '../helper/csvmulter'
import importUser from '../controller/csv.controller'

router.post('/importcsv',csvMiddleware.single('file'),importUser);

export default router;