const express=require('express')
const auth=require('../middlewares/auth')
const {User} = require('../models/userSchema')
const jwt=require('jsonwebtoken')
const config=require('config')
const mongoose=require('mongoose')
const TokenModel = require('../models/tokenSchema')
//create instance of express router
const router=express.Router()

router.get('/',auth,async (req,res)=>{
    const users=await User.find({})
    res.render('index',{users})
})

router.get('/login',(req,res)=>{
    if(req.cookies.data){
        const data=req.cookies.data
        return res.clearCookie('data').render('login',{message:data.message,status:data.status})
    }
    res.render('login',{message:"",status:""})
})
router.get('/register',(req,res)=>{
    if(req.cookies.data){
        const data=req.cookies.data
        return res.clearCookie('data').render('register',{message:data.message,status:data.status})
    }
    res.render('register',{message:"",status:""})
})
router.get('/forget_password',(req,res)=>{
    if(req.cookies.data){
        const data=req.cookies.data
        return res.clearCookie('data').render('forget_password',{message:data.message,status:data.status})
    }
    res.render('forget_password',{message:"",status:""})
})
router.get('/update-user/:id',auth,async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send("Invalid User")
    }
    const user=await User.findById({_id:req.params.id})
    if(user){
       return res.render('update_user',{message:"",status:"",user})
    }else{
        return res.redirect('/')
    }
})
router.get('/user/reset-link/:email/:token',async (req,res)=>{
    const {email,token}=req.params
    const user=await User.findOne({email})
    const token_validate=await TokenModel.findOne({token})
    if(user && token_validate){
        try{
            const verifyToken=jwt.verify(token,config.get('jwtPrivateKey'))
           if(verifyToken){
                 return res.status(200).render('reset_password',{email:user.email,token})
           }
        }
        catch(err){
            return res.status(400).render('link-response',{message:"Link Expired try again",status:"danger"})
        }
    }else{
        return res.status(400).render('link-response',{message:"Link Expired",status:"danger"})
    }
})

module.exports=router