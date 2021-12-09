const Joi=require('joi')

function validateRegister(request){
    const schema=Joi.object({
        name:Joi.string().min(3).max(30).required(),
        email:Joi.string().min(5).max(50).email().required(),
        password:Joi.string().min(4).max(70).required()
    })

    return schema.validate(request)
}
function validateLogin(request){
    const schema=Joi.object({
        email:Joi.string().min(5).max(50).email().required(),
        password:Joi.string().min(4).max(70).required()
    })

    return schema.validate(request)
}

module.exports={validateLogin,validateRegister}