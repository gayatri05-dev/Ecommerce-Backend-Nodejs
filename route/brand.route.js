import express from 'express';
import { addBrand , getBrands } from '../controller/brand.controller';

const router = express.Router();

router.post('/addbrand',addBrand)
router.get('/getbrand',getBrands)

export default router;