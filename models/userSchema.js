const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const config=require('config')

const {Schema,model}=mongoose

async function setHashPassword(pass){
    return await bcrypt.hash(pass,10)
}

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    file:{
      type:String,
      required:true
    },
    isLogin:{
       type:Boolean,
       default:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

userSchema.methods.generateAuthToken=function (){
    const token=jwt.sign({id:this._id,email:this.email,isLogin:this.isLogin},config.get('jwtPrivateKey'))
    return token 
}


const User=model('User',userSchema)

module.exports={User,setHashPassword}