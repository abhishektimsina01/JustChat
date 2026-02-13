import nodemailer from "nodemailer"

const transporter = nodemailer.transporter({
    secure : true,
    host : "smtp.gmail.com",
    service : "gmail",
    port : 465,
    auth : {
        user : process.env.email,
        pass : process.env.password
    }
})

export {transporter}