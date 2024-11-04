import mongoose from 'mongoose'

const Schema =  mongoose.Schema;

const CSVSchema = new Schema({
    Name:{
        type:String
    },
    Mobileno:{
        type:Number
    },
    Email:{
        type:String
    }
});

const Csv = mongoose.model("Csv",CSVSchema)
export default Csv;