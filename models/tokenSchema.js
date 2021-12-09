const mongoose=require('mongoose')

const {Schema,model}=mongoose

const tokenSchema=new Schema({
    token:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

const TokenModel=model('Token',tokenSchema)

module.exports=TokenModel