import { transporter } from "../mails/nodemailer.js";

const sendMail = async(mailOption) => {
    await transporter.sendMail(mailOption, (err, info) =>{
    if(err){
        throw err
    }
    else{
        console.log("email sent", info.respone)
    }
    })
}

export {sendMail}