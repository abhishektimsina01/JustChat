import {mailValidation} from "../validators/mail.validation.js"
import { mailDocuments } from "../mails/Mail.mail.js"
import fs from "fs"

const mailLogic = async(req, res, next) => {
    try{
        console.log("reached the controller")
        const {error, value} =  mailValidation.validate(req.body)
        if(error){
            throw error
        }

        //yedi user le kunai ni files bina upload garxa vhane
        if(req.files == undefined){
            const error = new Error("U must send file or files(image, pdf, docx etc) that u wanna mail!")
            error.status = 400
            next(error)
        }

        const files = req.files
        console.log(req.files)
        
        // reciever ko mail ya hunxa
        const {mail} = req.body  
        const text = req.body?.text ?? ""
        const filenameWithpath = files.map((file) =>{
            console.log({filename : file.originalname, path : file.path})
            return {filename : file.originalname, path : file.path}
        })  

        await mailDocuments(mail, filenameWithpath, text)

        // now, hmaile mail pathaisake paxi, server bata sabai gayeko attachments haru hamile hatauna milxa
        // for(let file of filenameWithpath){
        //     fs.unlinkSync(file.path)
        // }

        res.json({
            success : true,
            status : 200,
            message : "Mail sent successfully"
        })
    }
    catch(err){
        next(err)
    }
}

export {mailLogic}