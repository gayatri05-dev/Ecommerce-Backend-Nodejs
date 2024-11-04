import express from 'express';
import { createProduct ,fetchAllProducts,getProductById,updateProduct,getAllProduct} from '../controller/product.controller';
import { uploadMiddleware } from '../helper/multer';

const router = express.Router();

router.get('/getproduct' , fetchAllProducts);
router.post('/addproduct' , createProduct);
router.get('/:_id' , getProductById);
router.patch('/:id',updateProduct);
// router.delete('/:id',deleteProduct)
router.get('/getallproduct',getAllProduct)

export default router;
