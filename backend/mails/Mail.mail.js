import { sendMail } from "../helper/sendMail.js";
import { mailOption } from "./nodemailer.js";

const mailDocuments = async(email, filepaths, text) =>{
    mailOption.to = email
    mailOption.text = text
    mailOption.attachments = filepaths
    await sendMail(mailOption)
}

export {mailDocuments}