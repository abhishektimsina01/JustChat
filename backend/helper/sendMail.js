import { transporter } from "../mails/nodemailer.js";
import fs from "fs"
const sendMail = async(mailOption) => {
    const info = await transporter.sendMail(mailOption)
    console.log(info.response)
    const attachments = mailOption.attachments
    console.log(attachments)
    for(let file of attachments){
        fs.unlinkSync(file.path)
    }
}

export {sendMail}