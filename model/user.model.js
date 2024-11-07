import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed; 

const categorySchema = new Schema({
   firstName: {
      type: String,
      required: true
   },
   lastName: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true,
      unique: true
   },
   password: {
      type: String,
      required: true,
      unique: true
   },
   role: {
      type: String,
      required: true,
      default:'user'
   },
   orders: {
      type: [Schema.Types.Mixed]
   },
   addresses: {
      type:[Schema.Types.Mixed]
   }
  
});

const virtual = categorySchema.virtual('id');
virtual.get(function() {
    return this._id;
});

categorySchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
        delete ret._id;
    },
});

const User = mongoose.model('User', categorySchema);
export default User;
