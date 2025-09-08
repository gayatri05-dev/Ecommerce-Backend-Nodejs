import Order from "../model/order.model";
import Product from "../model/product.model";
import User from "../model/user.model";
import {sendMail , invoiceTemplate} from '../helper/common'

export const fetchOrdersByUser = async (req, res) => {
    const { id } = req.user;
    try {
      const orders = await Order.find({ user: id });
      res.status(200).json(orders);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
export const createOrder = async (req, res) => {
    const {items, selectedAddress, totalAmount, totalItems, paymentMethod } = req.body
    const itemObject = req.body
    const userId = itemObject.items[0].user.id
    try {
        for (let item of itemObject.items) {
            let product = await Product.findOne({ _id: item.product._id });
            if (product) {
                await Product.updateOne(
                    { _id: product._id },
                    { $inc: { stock: -1 * item.quantity } }
                );
            }
        }

        const orderObject = {
          items:items,
          selectedAddress:selectedAddress,
          totalAmount:totalAmount,
          totalItems:totalItems,
          paymentMethod:paymentMethod,
          user: userId
        }
        const order = new Order(orderObject);

        const doc = await order.save();
        const user = await User.findById(userId);
        
        await sendMail({
            to: user.email,
            html: invoiceTemplate(order, selectedAddress),
            subject: 'Your Order Is SucessFully Placed !'
        });

        res.status(201).json(doc);
    } catch (err) {
        res.status(400).json(err);
    }
};

  export const deleteOrder = async (req, res) => {
      const { id } = req.params;
      try {
      const order = await Order.findByIdAndDelete(id);
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  
  export const updateOrder = async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).json(order);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  export const fetchAllOrders = async (req, res) => {
    // sort = {_sort:"price",_order="desc"}
    // pagination = {_page:1,_limit=10}
    let query = await Order.find({}).populate('user');
    // let totalOrdersQuery = Order.find();
    console.log(query,"++++++++++++++");
  
    
    // if (req.query._sort && req.query._order) {
    //   query = query.sort({ [req.query._sort]: req.query._order });
    // }
  
    // const totalDocs = await totalOrdersQuery.count().exec();
    // console.log({ totalDocs });
  
    // if (req.query._page && req.query._limit) {
    //   const pageSize = req.query._limit;
    //   const page = req.query._page;
    //   query = query.skip(pageSize * (page - 1)).limit(pageSize);
    // }
  
    try {
      // const docs = await query.exec();
      // res.set('X-Total-Count', totalDocs);
      res.status(200).json(query);
    } catch (err) {
      res.status(400).json(err);
    }
  };
  