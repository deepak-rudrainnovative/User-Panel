const express=require('express')
require('./connection/connection')
const user=require('./routes/userRoute')
const home=require('./routes/homeRoute')
const cookieParser=require('cookie-parser')
const config=require('config')
const helmet=require('helmet')
const compression=require('compression')

//craete app instance of express
const app=express()

//check configuration of app
if(!config.get('jwtPrivateKey')){
    console.log('Fatal Error')
    process.exit(1)
}

//declare port of configuration and by default
const PORT= process.env.PORT||4000;


//using express middleware
// use json as body of request
app.use(express.json())
// use name of bady of request
app.use(express.urlencoded({extended:false}))
// use folder public as static folder
app.use(express.static(__dirname+'/public'))
app.use(cookieParser())
//use for security
app.use(helmet({contentSecurityPolicy:false}))
//use for compression
app.use(compression())
//middleare of route

app.use('/api',user)
app.use('',home)
//set express engine to ejs
app.set('view engine','ejs')
app.set('port', (4000));

//express app listen
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})