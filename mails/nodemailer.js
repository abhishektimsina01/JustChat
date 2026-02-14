import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    secure : true,
    host : "smtp.gmail.com",
    service : "gmail",
    port : 465,
    auth : {
        user : process.env.email,
        pass : process.env.password
    }
})

const mailOption = {
    from : "timsinaabhishek1@gmail.com",
    to : "",
    subject : "",
    text : "Email from JustChat"
}

export {transporter, mailOption}