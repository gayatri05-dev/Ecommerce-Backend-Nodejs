import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    items:{
        type:[Schema.Types.Mixed],
        required:true
    },
    totalAmount:{
        type:Number
    },
    totalItems:{
        type:Number
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    paymentMethod:{
        type:String,
        required:true,
        enum:{
                CREDIT_CARD: 'credit_card',
                PAYPAL: 'paypal',
                BANK_TRANSFER: 'bank_transfer'
        }
    },
    paymentStatus:{
        type:String,
        default:'pending'
    },
    status:{
        type:String,
        default:'pending'
    },
    selectedAddress:{
        type:Schema.Types.Mixed,
        // required:true
    }
},
    {
        timestamps:true
});

const Order = mongoose.model('Order',orderSchema)
export default Order;