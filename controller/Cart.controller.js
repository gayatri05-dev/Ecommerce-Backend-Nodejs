import Cart from "../model/cart.model";


export const getAllCartItems = async (req,res)=>{
    const {id} = req.user;
    try{
        const cartItems = await Cart.find({user:id}).populate('product')
        res.status(200).json(cartItems)
    } catch(err){
        res.status(400).json(err);
    }
}

// export const getToCartByUser = async(req,res)=>{
//     const {user} = req.params;
//     console.log("ASDFG",req.params)
//     try{
//         const cartItems = await Cart.find({user:user})
//         .populate('user')
//         .populate('product')
//         res.status(200).json(cartItems)
//     } catch(err){
//         res.status(400).json(err);
//     }
// }

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
        const savedCart = await cart.save();
        console.log(savedCart)
        // const populatedCart = await savedCart.populate('product').execPopulate();

        // return res.status(201).json(populatedCart);
        return res.status(201).json(savedCart); // changes
    } catch (err) {
        console.error("Error adding to cart:", err); // Log the error for debugging
        return res.status(400).json({ error: 'Unable to add to cart', details: err.message });
    }
};

// export const addToCart = async (req, res) => {
//     const cart = new Cart(req.body);

//     // // Optionally validate the incoming data here
//     // if (!category.name) { // Assuming 'name' is a required field
//     //     return res.status(400).json({ message: "Category name is required." });
//     // }

//     try {
//         const doc = await cart.save();
//         res.status(201).json(doc);
//     } catch (err) {
//         console.error(err); // Log the error for debugging
//         res.status(400).json({ message: "Error saving category", error: err }); // Provide more context
//     }
// };

// export const deleteFromCart = async (req,res)=>{
//     const {id} = req.params;
//     try{
//         const doc = await Cart.findByIdAndDelete(id);
//         res.status(200).json(doc);
//     } catch(err){
//         res.status(400).json(err)
//     }
// }

// export const updateCart = async (req,res)=>{
//     const {id} = req.params;
//     try{
//         const cart = await Cart.findByIdAndUpdate(id , req.body,{
//             new:true,
//         });
//         const result = await cart.populate('product');
//         res.status(200).json(result)
//     } catch(err){
//         res.status(400).json(err)
//     }
// }