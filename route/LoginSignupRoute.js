import express from 'express'
import { userRegister,getUserById, userLogin } from '../controller/LoginSignupController';
const router = express.Router();

router.post('/signup',userRegister);
// router.get('/:id' ,getUserById);
router.post('/loginuser',userLogin);
export default router;