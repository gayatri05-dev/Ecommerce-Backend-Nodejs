import express from 'express'
import { addCategory , getCategory } from '../controller/category.controller'

const router = express.Router();

router.post('/addcategory',addCategory);
router.get('/getcategory',getCategory)

export default router;