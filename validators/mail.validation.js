import Joi from "joi";

const mailValidation = Joi.object({
    mail : Joi.string().email().required(),
    filesLink : Joi.array().max(4).min(1).unique().required()
})


export {mailValidation}