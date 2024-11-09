import Cart from "../model/cart.model";
import Product from "../model/product.model";
import mongoose from 'mongoose'


export const getAllCartItems = async (req,res)=>{
    const {id} = req.user;
    try{
        const cartItems = await Cart.find({user:id}).populate('product')
        res.status(200).json(cartItems)
    } catch(err){
        res.status(400).json(err);
    }
}

export const getToCartbyUserId = async (req, res) => {
    console.log(req.params._id);
    
    // console.log("id",req.body.user)
    try {
        const cartItems = await Cart.find({ user: req.params._id})
        .populate('user')
        .populate('product')
        // console.log(users.length)
        res.status(200).json(cartItems)
    } catch (error) {
        res.status(500).json({ message: "Error in Fetching the data" })
    }
};



export const addToCart = async (req, res) => {
 
    // if (!req.user || !req.user.id) {
    //     return res.status(401).json({ error: 'User not authenticated' });
    // }

    // changes
    if (!req.params.id) {
        return res.status(401).json({ error: 'User not authenticated' });
    } 

    const { id } = req.params;
    const { quantity, product, size, color } = req.body;

    if (!quantity || !product) {
        return res.status(400).json({ error: 'Quantity and product are required' });
    }

    
    const cartData = {
        quantity,
        product,
        user: id,
        size,
        color
    };

    try {
        const cart = new Cart(cartData);
       
        const productCartData = await Cart.findOne({ user: id, product: product}).populate('user')
        .populate('product')

        if(productCartData){
           return res.status(200).send("Product already added...")
        }
        await cart.save();
        const productAdded = await Cart.findOne({ user: id, product: product}).populate('user')
        .populate('product')
        // const populatedCart = await savedCart.populate('product').execPopulate();
        // return res.status(201).json(populatedCart);
        return res.status(201).json(productAdded); // changes
    } catch (err) {
        console.error("Error adding to cart:", err); // Log the error for debugging
        return res.status(400).json({ error: 'Unable to add to cart', details: err.message });
    }
};


export const deleteFromCart = async (req, res) => {
    const { id } = req.params;
    console.log("REQ PARAMS" , req.params)
  
    try {
      // Validate the ID format before querying the database
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid cart item ID' });
      }
  
      const doc = await Cart.findByIdAndDelete(id);
  
      if (!doc) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
  
      res.status(200).json({ message: 'Cart item deleted', data: doc });
    } catch (err) {
      if (err.name === 'CastError') {
        console.error('Invalid cart item ID:', err);
        return res.status(400).json({ message: 'Invalid cart item ID' });
      } else {
        console.error('Error deleting cart item:', err);
        res.status(500).json({ message: 'Failed to delete cart item' });
      }
    }
  };



export const updateCart = async (req,res)=>{
    const {id} = req.params;
    try{
        const cart = await Cart.findByIdAndUpdate(id , req.body,{
            new:true,
        });
        const result = await cart.populate('product');
        res.status(200).json(result)
    } catch(err){
        res.status(400).json(err)
    }
}