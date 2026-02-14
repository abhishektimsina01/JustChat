import { required } from "joi";
import mongoose from "mongoose";

const MailModelSchema = new mongoose.Schema({
    mail : {type : String, required : true},
    
},{timestamps : true, versionKey : false})