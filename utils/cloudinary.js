// setup the cloudinary
// cloudinary vhaneko chai, photos/images, video, document(ppt, pdf, docs) etc
// haru easily store garna milne cloud ho, from where we will get id for each save we do

import { v2 as Cloudinary } from "cloudinary";
import dotenv from "dotenv"
dotenv.config()

Cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key : process.env.api_key,
    api_secret: process.env.api_secret
})

export {Cloudinary}