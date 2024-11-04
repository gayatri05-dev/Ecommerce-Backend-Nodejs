import express from 'express';
import cors from "cors";
import authRouter from './route/auth.route'
import authenticateToken from './middleware/verifyjwt';
import bodyParser from 'body-parser';
import csvRouter from './route/csv.route'
import path from 'path';
import productRouter from './route/product.route'
import userRouter from './route/user.route';
import brandRouter from './route/brand.route';
import categoryRouter from './route/category.route';
import loginSignup from './route/LoginSignupRoute';
import cartRouter from './route/Cart.route';
import orderRouter from './route/Order.route'


const __dirname = path.dirname(__filename);
const app = express();

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors({origin:"*"}))

app.use('/api',authRouter);
// Serve static files from the 'uploads' directory
app.use('/images', express.static('images'));

app.use('/api',csvRouter);
app.use("/csv",express.static(path.resolve(__dirname,'csv')));
app.use('/products' , productRouter);
app.use('/api',userRouter);
app.use('/brand',brandRouter);
app.use('/category',categoryRouter);
app.use('/auth',loginSignup);
app.use('/cart',cartRouter);
app.use('/order',orderRouter)

export default app;