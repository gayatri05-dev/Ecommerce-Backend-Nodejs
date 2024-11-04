import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import Auth from '../model/auth.model.js'; 

export const userRegister = async (req, res) => {
    try {
        const { firstName, lastName, email, password, DOB, isMarried, gender } = req.body;
        console.log(req.body);

        
        const hashedPass = await bcrypt.hash(password, 10);
        console.log(hashedPass);

        let profile = req.file ? req.file.filename : null; 

        
        const newuser = new Auth({
            firstName,
            lastName,
            email,
            password: hashedPass,
            DOB,
            isMarried,
            gender,
            profile: profile,  // Save the filename or file path here
        });
        console.log(newuser);

        // Save the new user in the database
        await newuser.save();

        // Respond with the newly created user
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

        const user = await Auth.findOne({email:email});
        console.log(user)

        if(!user) return res.status(400).send("User not found");
        console.log(!user)

        const isMatch = await bcrypt.compare(password , user.password)
        console.log(isMatch)

        if(!isMatch) return res.status(400).send('Credntial Invalid');
        console.log(!isMatch)


        const token = jwt.sign({email:user.email , id:user._id}, 'your_jwt_secret',{expiresIn:'1h'});
        console.log(token);
        res.json({token, user});
    } catch(err){
        res.status(500).send("error logged In")
    }
};

