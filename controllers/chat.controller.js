import { upload } from "../middleware/multer.js";
import {Cloudinary} from "../utils/cloudinary.js"
import {RoomModel} from "../models/room.model.js"
import fs from "fs"

const fetchRoomId = async(req, res, next) =>{
    try{
        const {roomId} = req.params
        console.log(roomId)

        // we have to create the room if there no any in the database with that roomId
        const room = await RoomModel.findOne({roomId : roomId})

        if(!room){
            console.log(roomId, "not found")
            //so we create one
            room = await RoomModel.create({
                roomId : roomId
            })
            console.log("new room", room, "created")
        }
        
        res.json({
            room : room.roomId,
            messages : room.messages
        })
    }
    catch(err){
        next(err)
    }
}


const uploadFile = async(req, res, next) =>{
    try{

        // yedi malai 0 file send gareko xa vhane maile error falna parney hunxa
        // since malai pathako files haru sabai maile middleware bata parsing garera req.file bata pauna sakxu
        if(req.files == undefined){
            const err = new Error("No file was sent, you must sent")
            err.status = 400
            throw(err)
        }
        const secure_urls = []
        // maile ya aba harek eeuta files haru jun req.files ma aauxa teslai maile aba sabai vhnda suruma
        // cloudinary ma save garera matra response pathauna parney hunxaa, ra tyo pani after unlicking
        const filepaths = await Promise.all(
            req.files.map(async (file) => {
                const response = await Cloudinary.uploader.upload(file.path, { folder: "uploads" });
                console.log(response.secure_url);
                secure_urls.push(response.secure_url); // optional if you need a separate array
                console.log(file.originalname, file.path);
                return {
                filename: file.originalname,
                path: file.path,
                secure_url: response.secure_url
                };
            })
        );

        console.log(filepaths)

        console.log(req.files)
        //sabai kam vhayepaxi remove the files from our uploads
        for(let file of req.files){
            fs.unlinkSync(file.path)
        }
        res.json({
            status : 200,
            success : true,
            secure_urls : [...secure_urls],
            filepaths : filepaths
        })
    }
    catch(err){
        next(err)
    }
    
}

export {fetchRoomId, uploadFile}