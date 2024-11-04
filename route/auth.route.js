import express from "express";
import { userRegister , userLogin} from "../controller/auth.controller";
import { uploadMiddleware } from "../helper/multer";
const router = express.Router();
import authenticateToken from "../middleware/verifyjwt";

router.post('/register',uploadMiddleware,userRegister);
router.post('/login',userLogin);
router.get('/api/protected', authenticateToken, (req, res) => {
    res.status(200).send('This is a protected route');
  });


export default router;