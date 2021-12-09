const jwt=require('jsonwebtoken')
const config=require('config');
const { User } = require('../models/userSchema');

module.exports=async function (req,res,next){

    const token=req.cookies['x-auth-token'];

    if(token){
        try{
            const result=jwt.verify(token,config.get('jwtPrivateKey'))
            const id=result.id
            const user=await User.findOne({_id:id,isLogin:true})
            if(result && user){
                next()
            }else{
                res.status(200).redirect('/login')
            }
        }catch(err){
            return res.status(400).send({message:"User Not Found",status:"danger"}).redirect('/login')
        }
        
    }else{
        return res.status(403).cookie('data',{message:"",status:"warning"}).redirect('/login')
    }
   
}