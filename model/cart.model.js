import mongoose from 'mongoose'
const Schema = mongoose.Schema

const cartSchema = new Schema ({
    quantity:{
        type:Number,
        required:true
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:'Product',
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    size:{
        type:Schema.Types.Mixed
    },
    color:{
        type:Schema.Types.Mixed
    }
})


cartSchema.virtual('id').get(function() {
    return this._id;
});

cartSchema.set('toJSON',{
    virtuals :true,
    versionKey:false,
    transform:function(doc,ret) {delete ret._id}
})

const Cart = mongoose.model("cart",cartSchema);
export default Cart;