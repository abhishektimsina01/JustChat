import mongoose from "mongoose";

const MailModelSchema = new mongoose.Schema({
    mail : {type : String, required : true}
},{timestamps : true, versionKey : false})

const MailModel = mongoose.model("mailmodel", MailModelSchema)

export {MailModel}