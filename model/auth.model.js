import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const authSchema = new Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    DOB:{
        type:Date,
        required:true,
    },
    isMarried:{
      type:Boolean,
      required:false
    },
    gender:{
        type:String,
        enum:["male","female"],
        required:true,
    },
    profile:{
        type:String,
        required:true
    }

});

const Auth = mongoose.model("Auth" ,authSchema);
export default Auth;




