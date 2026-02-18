import { upload } from "../middleware/multer.js";
import {Cloudinary} from "../utils/cloudinary.js"
import {RoomModel} from "../models/room.model.js"
import fs from "fs"
import { io } from "../index.js";

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

        res.cookie("roomId", roomId,{
            httOnly : true,
            secure : true,
            site : "static",
            maxAge : 24 * 60 * 60 * 100}).json({
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
        const roomId = req.cookies.roomId

        const room = await RoomModel.findOne({roomId : roomId})
        if(!room){
            const err = new Error("room doesnt exist")
            err.status = 400
            throw err
        }
        if(roomId == undefined){
            const err = new Error("cookie not provided")
            err.status = 400
            next(err)
        }
        console.log("room Id:- ", roomId)
        // yedi malai 0 file send gareko xa vhane maile error falna parney hunxa
        // since malai pathako files haru sabai maile middleware bata parsing garera req.file bata pauna sakxu
        if(req.files == undefined){
            const err = new Error("No file was sent, you must sent")
            err.status = 400
            throw(err)
        }

        // maile ya aba harek eeuta files haru jun req.files ma aauxa teslai maile aba sabai vhnda suruma
        // cloudinary ma save garera matra response pathauna parney hunxaa, ra tyo pani after unlicking
        const filepaths = await Promise.all(
            req.files.map(async (file) => {
                const response = await Cloudinary.uploader.upload(file.path, { folder: "uploads" });
                console.log(file.originalname, file.path);
                return {
                    msgType: file.originalname,
                    message: response.secure_url
                };
            })
        ); 

        console.log(room)
        room.messages.push(...filepaths)
        await room.save()
        console.log(room)
        for(let file of req.files){
            fs.unlinkSync(file.path)
        }

        //file upload vhaisake paxi
        io.to(roomId).emit("file", filepaths)

        res.json({
            status : 200,
            success : true,
            room
        })
    }
    catch(err){
        next(err)
    }
    
}

export {fetchRoomId, uploadFile}