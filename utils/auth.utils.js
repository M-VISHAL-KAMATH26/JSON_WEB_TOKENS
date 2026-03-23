const jwt=require('jsonwebtoken');

const signToken=(userId)=>{
    return jwt.sign({id:userId},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_IN ||"7d"});
}
const sanitizeUser=(user)=>{
    const obj=user.toObject?user.toObject:user;
    delete obj.password;
    return obj;
}

module.exports={signToken,sanitizeUser};