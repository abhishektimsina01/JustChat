import {mailValidation} from "../validators/mail.validation.js"
import { Cloudinary } from "../utils/cloudinary.js"
import { upload } from "../middleware/multer.js"

const mailLogic = (req, res, next) => {
    try{
        const {error} = mailValidation.validate(req.body)
        if(error){throw error}
        const {mail} = req.body
    }
    catch(err){
        next(err)
    }
}

export {mailLogic}