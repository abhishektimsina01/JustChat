import {mailValidation} from "../validators/mail.validation.js"


const mailLogic = (req, res, next) => {
    try{
        const {error} = mailValidation.validate(req.body)
        if(error){throw error}

        //yedi user le kunai ni files bina upload garxa vhane
        if(length(req.files) == 0){
            const error = new Error("U must send file/files(image, pdf, docx etc) that u wanna share!")
            error.status = 400
            next(error)
        }
        // reciever ko mail ya hunxa
        const {mail} = req.body

        

    }
    catch(err){
        next(err)
    }
}

export {mailLogic}