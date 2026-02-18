import Joi from "joi";

const mailValidation = Joi.object({
    mail : Joi.string().email().required(),
    text : Joi.string().max(40).allow("").optional()
})


export {mailValidation}