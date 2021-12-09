const mongoose=require('mongoose')
const config=require('config')

const dbUrl=config.get('db')

//create a connection on mongodb

module.exports=mongoose.connect(dbUrl).then((conn)=>{
    console.log('Database Connected'+dbUrl)
}).catch((err)=>{
    console.log(err.message)
})