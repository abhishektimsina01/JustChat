import { upload } from "../middleware/multer.js";
import {Cloudinary} from "../utils/cloudinary.js"
import {RoomModel} from "../models/room.model.js"

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

export {fetchRoomId}