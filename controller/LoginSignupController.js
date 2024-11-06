import User from '../model/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

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

export const userLogin = async (req,res) =>{
  try{
      const {email , password} = req.body;
      console.log(req.body)

      const user = await User.findOne({email:email});
      console.log(user)

      if(!user) return res.status(400).send("User not found");
      console.log(!user)

      const isMatch = await bcrypt.compare(password , user.password)
      console.log(isMatch)

      if(!isMatch) throw new Error('Credntial Invalid');
    //   if(!isMatch) return res.status(400).send('Credntial Invalid');
      console.log(!isMatch)


      const token = jwt.sign({email:user.email , id:user._id}, 'your_jwt_secret',{expiresIn:'1h'});
      console.log(token);
      res.json({token, user});
  } catch(err){
      res.status(500).error("error logged In" + err.message);
  }
};
