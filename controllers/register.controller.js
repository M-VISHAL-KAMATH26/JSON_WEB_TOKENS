const bcrypt=require('bcryptjs');
const User=require('../models/User');
const {signToken,sanitizeUser}=require('../utils/auth.utils');
const register=async(req,res,next)=>{
    try{
        const {name,email,password}=req.body;
        if(!name||!email||!password){
            return res.status(400).json({mesage:"felds are reuired"});
        }
        const normalEmail=String(email).toLocaleLowerCase().trim();
        const existing=await User.findOne({email:normalEmail});
        if(existing){
        const token=signToken(existing._id);
        return res.status(200).json({
            message:"user already exist",
            token,
            user:sanitizeUser(existing)
        })
        }

       const hashed=await bcrypt.hash(password,10);
       const user=await User.create({
        name:String(name).trim(),
        email:normalEmail,
        password:hashed
       }) 
        const token = signToken(user._id);
    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: sanitizeUser(user)
    });


    }catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports={register};