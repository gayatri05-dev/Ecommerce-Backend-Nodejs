import express from 'express'
import { createOrder,fetchAllOrders ,updateOrder,deleteOrder} from '../controller/Order.controller';

const router = express.Router();

router.post('/addorder',createOrder);
router.get('/getorder',fetchAllOrders);
router.post('/remove/:id',deleteOrder);
router.patch('/update/:id',updateOrder)

export default router;