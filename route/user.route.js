import express from 'express';
import { getUserById ,updateUser ,userRegister } from '../controller/user.controller';
import authenticateToken from '../middleware/verifyjwt';

const router = express.Router();

router.patch('/update',updateUser);
router.get('/:id', authenticateToken ,getUserById);
router.post('/add',userRegister)

export default router;