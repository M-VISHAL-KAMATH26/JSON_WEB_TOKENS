const jwt=require('jsonwebtoken');

const authenticate=(req,res,next)=>{
    try{
    const token=req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"token not found"})
    }
    const decode=jwt.verify(token,process.env.JWT_SECRET);
    req.user=decode;
    next;
}catch(err){
    return res.status(401).json({message:"invalid token"});
}
}
module.exports={authenticate};