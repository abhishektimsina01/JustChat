import Joi from "joi";

const mailValidation = Joi.object({
    mail : Joi.string().email().required()
})


export {mailValidation}