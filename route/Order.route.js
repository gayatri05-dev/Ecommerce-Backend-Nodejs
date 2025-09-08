import express from 'express'
import { createOrder,fetchAllOrders ,updateOrder,deleteOrder,fetchOrdersByUser} from '../controller/Order.controller';

const router = express.Router();

router.post('/addorder',createOrder);
router.get('/getorder',fetchAllOrders);
router.post('/remove/:id',deleteOrder);
router.patch('/update/:id',updateOrder);
router.get('/:id',fetchOrdersByUser)

export default router;