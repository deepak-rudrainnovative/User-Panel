const express=require('express')
const {validateLogin,validateRegister}=require('../middlewares/validator')
const {User,setHashPassword} = require('../models/userSchema')
const bcrypt=require('bcrypt')
const nodemailer = require('nodemailer');
const jwt=require('jsonwebtoken')
const config=require('config')
const mongoose=require('mongoose')
const auth=require('../middlewares/auth');
const TokenModel = require('../models/tokenSchema');
const fs=require('fs')
const path=require('path')
const multer=require('multer')
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./public/uploads");
    },
    filename: (req, file, cb) => {
      const ext = file.mimetype.split("/")[1];
      cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    },
  });

  const upload = multer({
    storage: multerStorage
  });


let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'your-gmail',
          pass: 'your pass'
        }
});

//create instance of express router
const router=express.Router()

router.post('/user/login',async (req,res)=>{
    const {email,password}=req.body
    const {error}=validateLogin(req.body)
    if(error){
        return res.status(400).send({message:error.details[0].message,status:"danger"})
    }
    
    const user=await User.findOne({email})
    if(!user){
        return res.status(400).send({message:"Email is not found register please",status:"danger"})
    }
    if(!user.isLogin){
        return res.status(400).send({message:"Your Account is disable",status:"danger"})
    }
    const decodedPassword=await bcrypt.compare(password,user.password)
    if(user && decodedPassword){
        const token=user.generateAuthToken()
        return res.status(200).cookie('x-auth-token',token).redirect('/')
    }else{
        return res.status(400).send({message:"Email and Password Wrong",status:"danger"})
    }
})

router.post('/user/register',upload.single('file'),async (req,res)=>{
    const {name,email,password}=req.body
    const {error}=validateRegister({name,email,password})
    if(error){
        return res.status(400).send({message:error.details[0].message,status:"danger"})
    }
    const oldUser=await User.findOne({email})
    if(oldUser){
        return res.status(400).send({message:"User already registerd",status:"danger"})
    }
    const hashpass=await setHashPassword(password)
    //file upload
    
    const filename=req.file.filename
    const user=new User({name,email,password:hashpass,file:filename})

    const result=await user.save()

    if(result){
        return res.status(200).render('register',{message:"Successfully registered Login Please",status:"success"})
    }else{
        return res.status(400).send({message:"User not registered",status:"danger"})
    }
})

router.post('/user/forget-password',async (req,res)=>{
     const {email}=req.body

     const user=await User.findOne({email})
     
   
     if(user){
        const token=jwt.sign({id:user._id},config.get('jwtPrivateKey'), { expiresIn: 60 * 10 });
        const t=new TokenModel({token})
        await t.save()
        const link=`https://user-panel1.herokuapp.com/user/reset-link/${email}/${token}`
        const msg = {
            from: 'deepak.kumar@rudrainnovative.in', // Sender address
            to: email,                          // User email
            subject: 'Password Reset Link ', // Subject line
            html: `<div>
                        <h3>Hello ,${user.name}</h3>
                        <br><br>
                        <p>your password reset link </p>
                        <br><br>
                        <a href=${link} >Reset Your Password </a>
                        <br><br>
                        <p>Thank, you</p>
            
                   </div>`
        };

        transport.sendMail(msg, function(err, info) {
            if (err) {
              res.status(400).send({message:err,status:"danger"})
            } else {
              res.status(200).send({message:"mail send successfully",status:"success"})
            }
        });
     }else{
         return res.status(400).send({message:"Email Not Found Register Please",status:"info"})
     }
})

router.post('/user/reset-password',async(req,res)=>{
    const email=req.body.email
    const password=req.body.password
    const token=req.body.token
    const hasPassword=await setHashPassword(password)
    const user=await User.findOneAndUpdate({email:email},{$set:{password:hasPassword}})
    
    if(user){
        await TokenModel.deleteOne({token})
        res.status(200).render('link-response',{message:"Password changed Successfully",status:"success"})
    }
    else{
        res.status(400).render('link-response',{message:"Password not  changed",status:"danger"})
    }
})

router.delete('/user/:id',auth,async  (req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send("Invalid User")
    }
    const users=await User.find({})
    const user=await User.findByIdAndDelete({_id:req.params.id})
    if(user){
        res.status(200).render('index',{users})
    }else{
        res.status(400).redirect('/')
    }
})
//user update our record
router.put('/user/:id',auth,async (req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send("Invalid User")
    }
    let isLogin;
    if(req.body.isLogin=="on"){
        isLogin=true
    }else{
        isLogin=false
    }
    const {name,email}=req.body
    
    const user=await User.findByIdAndUpdate({_id:req.params.id},{$set:{name,email,isLogin}})

    if(user){
        res.status(200).render('update_user',{message:"User Updated Successfully",status:"success",user})
    }else{
        res.status(400).redirect('/')
    }
})
// update document
router.put('/user/change-document/:id',upload.single('file'),async(req,res)=>{
    if(!mongoose.Types.ObjectId.isValid(req.params.id)){
        return res.status(400).send("Invalid User")
    }
    const user=await User.findOneAndUpdate({_id:req.params.id},{$set:{file:req.file.filename}})
    if(user){
        res.status(200).send({message:"document changed successfully"})
    }
    else{
        res.status(400).send({message:"not change"})
    }
})


module.exports=router
