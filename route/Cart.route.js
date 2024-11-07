import express from 'express'
import { getToCartbyUserId,updateCart,deleteFromCart,addToCart,getAllCartItems } from '../controller/Cart.controller';
// import authenticateToken from '../middleware/verifyjwt'
const router = express.Router();

router.post('/addtocart/:id',addToCart); // changes
router.get('/getcartuser',getAllCartItems);
router.get('/:_id',getToCartbyUserId)
router.delete('/:id',deleteFromCart);
router.patch('/update/:id',updateCart)

export default router;