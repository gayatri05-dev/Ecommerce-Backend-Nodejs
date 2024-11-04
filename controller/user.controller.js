import User from '../model/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const getUserById  = async (req,res) =>{
    const {id} = req.user;
    console.log(id)
    try{
        const user = await User.findById(id);
        res.status(200).json({
            id:user.id,
            firstName:user.firstName,
            lastName:user.lastName,
            email:user.email,
            role:user.role

        })
    }catch(err){
        res.status(400).json(err)

    }
}

export const updateUser = async (req,res) =>{
    const {id} = req.params;
    try{
        const user = await User.findByIdAndUpdate(id ,req.body,{new:true});
        res.status(200).json(user);

    } catch(err){
        res.status(400).json(err)
    }
}

// export const registerUser = async (req ,res) =>{
//     const user = new User(req.body);
//     try{
//       const doc = await user.save();
//       res.status(201).json(doc);
//     } catch(err){
//       res.status(400).json(err)
//     }
//   }
  // export const loginUser = async (req,res) =>{
  //   try{
  //     const user = await User.findOne({email:req.body.email} , 'id name email');
  //     res.status(201).json(user)
  //   } catch(err){
  //     res.status(400).json(err)
  //   }
  // }
  export const userRegister = async (req, res) => {
    try {
        const { firstName, lastName, email,password} = req.body;
        console.log(req.body);

        const hashedPass = await bcrypt.hash(password, 10);
        console.log(hashedPass);
        
        const newuser = new User({
            firstName,
            lastName,
            email,
            password: hashedPass,
             
        });
        console.log(newuser);  
        await newuser.save();

        res.status(200).json(newuser);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error registering user");
    }
};

