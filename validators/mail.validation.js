import Joi from "joi";

const mailValidation = Joi.object({
    mail : Joi.string().email().required(),
    filesLink : Joi.array().max().min(1).unique().required()
})


export {mailValidation}